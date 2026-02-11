# Plan: Admin Roles + Request Help with Visibility Tiers

## Overview

Add a community-scoped "Request Help" system with 3 privacy tiers, leveraging the existing `MemberRole` (ADMIN/MODERATOR/MEMBER) on `CommunityMember`. The key insight: **the admin role system already exists** — we need to extend the Post model to be community-aware and add visibility controls.

## What Changes

### 1. Prisma Schema (`server/prisma/schema.prisma`)

**Add `RequestVisibility` enum:**
```
enum RequestVisibility {
  PUBLIC
  SEMI_ANONYMOUS
  ADMIN_ONLY
}
```

**Add `HelpRequest` model** (new model, separate from existing Post to keep backward compat):
```
model HelpRequest {
  id            String              @id @default(uuid())
  communityId   String
  userId        String              // the actual requester
  title         String
  description   String
  category      String              // e.g. "groceries", "childcare", "financial", "transportation"
  visibility    RequestVisibility   @default(PUBLIC)
  status        PostStatus          @default(OPEN)      // reuse existing enum
  proxyPostId   String?             @unique             // if an admin created an anonymized proxy
  expiresAt     DateTime?           // auto-archive after fulfilled
  createdAt     DateTime            @default(now())
  updatedAt     DateTime            @updatedAt

  community     Community           @relation(...)
  user          User                @relation(...)

  @@index([communityId])
  @@index([status])
  @@index([visibility])
}
```

**Update `Community` model** — add `helpRequests HelpRequest[]` relation.
**Update `User` model** — add `helpRequests HelpRequest[]` relation.
**Add `HELP_REQUEST` to `NotificationType` enum.**

### 2. Server: Help Requests Controller (`server/src/controllers/helpRequests.controller.ts`) — NEW FILE

Endpoints:
- `POST /` — Create help request (requires community membership)
- `GET /community/:communityId` — Get help requests for a community (filters by visibility based on user's role)
- `GET /admin/:communityId` — Admin inbox: get ADMIN_ONLY requests (requires ADMIN/MODERATOR role)
- `GET /:id` — Get single help request (visibility-gated)
- `PATCH /:id/status` — Update status (requester or admin)
- `POST /:id/proxy` — Admin creates anonymous proxy post from an ADMIN_ONLY request
- `DELETE /:id` — Delete (requester or admin)

**Key visibility logic in `GET /community/:communityId`:**
- Always include PUBLIC requests (show full user info)
- Always include SEMI_ANONYMOUS requests (show "A community member" instead of user info)
- Only include ADMIN_ONLY if requesting user is ADMIN or MODERATOR
- Never expose real user identity for SEMI_ANONYMOUS to non-admins

### 3. Server: Help Requests Routes (`server/src/routes/helpRequests.routes.ts`) — NEW FILE

Standard Express router following existing patterns. All routes require `authenticate` middleware.

### 4. Server: Register Routes (`server/src/index.ts`)

Add: `import helpRequestsRoutes from './routes/helpRequests.routes'`
Add: `app.use('/api/help-requests', helpRequestsRoutes)`

### 5. Server: Notification Service (`server/src/services/notification.service.ts`)

Add `notifyAdminHelpRequest()` method — notifies all ADMIN/MODERATOR members of a community when an ADMIN_ONLY request comes in.

### 6. Client: Types (`client/src/types/index.ts`)

Add:
```ts
enum RequestVisibility { PUBLIC, SEMI_ANONYMOUS, ADMIN_ONLY }

interface HelpRequest {
  id, communityId, userId, title, description, category,
  visibility, status, proxyPostId?, expiresAt?, createdAt, updatedAt,
  user: { id, firstName, lastName, profilePicture? } | null,  // null when anonymous
  community: { id, name }
}

interface CreateHelpRequestData {
  communityId, title, description, category, visibility
}
```

### 7. Client: Help Requests Service (`client/src/services/helpRequests.service.ts`) — NEW FILE

API methods matching the controller endpoints.

### 8. Client: CreateHelpRequestForm Component (`client/src/components/posts/CreateHelpRequestForm.tsx`) — NEW FILE

Form with:
- Community selector (dropdown of user's communities)
- Category selector with smart visibility defaults
- Visibility tier picker (3 options with clear descriptions)
- Title + description fields
- Visual indicator showing what others will see based on chosen visibility

### 9. Client: HelpRequestCard Component (`client/src/components/posts/HelpRequestCard.tsx`) — NEW FILE

Like PostCard but:
- Shows visibility badge
- For SEMI_ANONYMOUS: shows "A community member" with generic avatar
- For ADMIN_ONLY: shows admin badge + real identity (only rendered for admins)

### 10. Client: Posts Page (`client/src/pages/Posts.tsx`)

Add a "Help Requests" tab/section alongside existing posts. Add a "Request Help" button that opens the new form.

### 11. Client: CommunityDetail Page (`client/src/pages/CommunityDetail.tsx`)

Add "Help Requests" section showing community-scoped requests. Add "Admin Inbox" button for admins that shows ADMIN_ONLY requests.

### 12. Client: AdminInbox Component (`client/src/components/community/AdminInbox.tsx`) — NEW FILE

Admin-only view showing:
- ADMIN_ONLY requests with full requester identity
- "Share Anonymously" button to create proxy post
- Status management (mark fulfilled, etc.)

### 13. Prisma Migration

Run `npx prisma migrate dev --name add-help-requests` to create the migration.

## File Summary

**New files (7):**
1. `server/src/controllers/helpRequests.controller.ts`
2. `server/src/routes/helpRequests.routes.ts`
3. `client/src/services/helpRequests.service.ts`
4. `client/src/components/posts/CreateHelpRequestForm.tsx`
5. `client/src/components/posts/HelpRequestCard.tsx`
6. `client/src/components/community/AdminInbox.tsx`
7. Prisma migration file (auto-generated)

**Modified files (6):**
1. `server/prisma/schema.prisma` — add HelpRequest model, RequestVisibility enum, relations, NotificationType
2. `server/src/index.ts` — register help-requests routes
3. `server/src/services/notification.service.ts` — add admin notification method
4. `client/src/types/index.ts` — add HelpRequest types
5. `client/src/pages/Posts.tsx` — add Help Requests tab + Request Help button
6. `client/src/pages/CommunityDetail.tsx` — add Help Requests section + Admin Inbox

## Implementation Order

1. Schema + migration
2. Server controller + routes + notification
3. Client types + service
4. Client components (form, card, admin inbox)
5. Client page integration (Posts, CommunityDetail)
