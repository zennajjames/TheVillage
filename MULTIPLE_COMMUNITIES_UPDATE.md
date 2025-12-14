# Multiple Communities & Children Management Update

## Overview

Updated The Village to support:
1. Users can join multiple school communities (for families with children at different schools)
2. Children management (track child's name and grade level)
3. Associate children with specific communities
4. Privacy settings for showing children's names

## Changes Made

### 1. Fixed Browse Communities Button

**File**: `/client/src/components/communities/FindYourSchool.tsx`

**Issue**: Button was pointing to `/communities` instead of `/browse-communities`

**Fix**:
```typescript
<button
  onClick={() => navigate('/browse-communities')} // Changed from /communities
  className="text-purple-600 hover:text-purple-700 font-medium text-sm"
>
  Browse all communities →
</button>
```

### 2. Added Missing Schools to Seed Data

**File**: `/server/prisma/seed.ts`

**Added**:
- Lake Nokomis - Wenonah (55417)
- Lake Nokomis - Keewaydin (55417)

Both schools are in South Minneapolis at zip code 55417.

**Total schools now**: 31 Minneapolis Public Schools

### 3. Removed One-Community Restriction

**File**: `/server/src/controllers/communities.controller.ts`

**Before**: Users could only be in one community. Joining a new one would automatically leave the current one.

**After**: Users can join multiple communities.

**Change**:
```typescript
// BEFORE - checked all user communities and removed them
const existingMemberships = await prisma.communityMember.findMany({
  where: { userId },
});
// ... removed user from current community ...

// AFTER - only check if already in THIS specific community
const existingMembership = await prisma.communityMember.findUnique({
  where: {
    communityId_userId: {
      communityId: id,
      userId,
    },
  },
});

if (existingMembership) {
  return res.status(400).json({ error: 'Already a member of this community' });
}
```

### 4. Database Schema Updates

**File**: `/server/prisma/schema.prisma`

#### Added Child Model
```prisma
model Child {
  id        String   @id @default(uuid())
  userId    String
  firstName String
  gradeLevel String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user              User              @relation(fields: [userId], references: [id], onDelete: Cascade)
  communityChildren CommunityChild[]

  @@index([userId])
}
```

#### Added CommunityChild Model
```prisma
model CommunityChild {
  id          String   @id @default(uuid())
  communityId String
  childId     String
  addedAt     DateTime @default(now())

  community Community @relation(fields: [communityId], references: [id], onDelete: Cascade)
  child     Child     @relation(fields: [childId], references: [id], onDelete: Cascade)

  @@unique([communityId, childId])
  @@index([communityId])
  @@index([childId])
}
```

#### Updated User Model
```prisma
model User {
  // ... existing fields ...

  // Privacy settings
  showEmail         Boolean @default(false)
  showAddress       Boolean @default(false)
  showPhone         Boolean @default(false)
  showChildrenNames Boolean @default(false)  // NEW
  allowMessages     Boolean @default(true)

  // ... existing relations ...
  children          Child[]  // NEW
}
```

#### Updated Community Model
```prisma
model Community {
  // ... existing fields ...

  createdBy User              @relation("CreatedCommunities", fields: [createdById], references: [id], onDelete: Cascade)
  members   CommunityMember[]
  groups    Group[]
  children  CommunityChild[]  // NEW
}
```

### 5. Updated Communities Page

**File**: `/client/src/pages/Communities.tsx`

**Changes**:
- Reverted to showing "My Communities" with tabs
- Default tab is "My Communities" (not "All")
- Can view all communities in separate tab
- Shows multiple communities if user has joined multiple schools
- Each community card is clickable to view details
- If no communities, redirects to `/find-your-school`

**Key Features**:
- Tab navigation: "My Communities" | "All Communities"
- Grid view of community cards
- Join/Member status for each community
- Community stats at bottom

## Database Migration Required

Run the following command to apply schema changes:

```bash
cd server
npm run migrate:dev
```

This will:
- Add `Child` table
- Add `CommunityChild` table
- Add `showPhone` column to `User` table
- Add `showChildrenNames` column to `User` table
- Add relation between `Community` and `CommunityChild`

## Next Steps (To Be Implemented)

### 1. Add Child Entry When Joining Community

Create a modal/form that appears when user clicks "Join Community":
- Ask for child's first name
- Ask for child's grade level
- Create Child record
- Create CommunityChild record
- Join the community

### 2. Profile Page - Manage Children

Add a "Children" section to the Profile page:
- List all user's children
- Add new child button
- Edit child name/grade
- Delete child
- Show which communities each child is associated with

### 3. Privacy Settings - Children Names

Add toggle to Privacy settings:
- "Show my children's names to other members"
- Default: OFF (false)
- When OFF: Only show grades, not names
- When ON: Show both names and grades

### 4. Community Detail - Show Children

On community detail page, show:
- Which of your children attend this school
- Option to add another child to this community
- Option to remove child from community

## User Experience

### Multiple Children Scenario

**Example**: Parent has 2 children at different schools

1. **First School**:
   - User signs up, finds school A
   - Joins school A
   - Adds child "Emma, Grade 3"
   - Can join groups/classrooms for Emma

2. **Second School**:
   - Clicks "All Communities" tab
   - Finds school B
   - Joins school B
   - Adds child "Noah, Grade 5"
   - Can join groups/classrooms for Noah

3. **My Communities**:
   - User now sees both school A and school B
   - Can switch between communities
   - Each community shows relevant groups and activities

### Privacy

- By default, children's names are hidden from other members
- Only grade levels are visible
- User can toggle privacy setting to show names
- Useful for coordinating with teachers and room parents

## Testing

### Manual Test Cases

1. **Test Multiple Communities**:
   - Join school A
   - Navigate to All Communities
   - Join school B
   - Go to "My Communities" - verify both schools appear
   - Click each school - verify you can access both

2. **Test Browse Button**:
   - Go to `/find-your-school`
   - Click "Browse all communities"
   - Verify navigates to `/browse-communities`

3. **Test Missing Schools**:
   - Run seed script
   - Search zip code 55417
   - Verify Lake Nokomis - Wenonah and Keewaydin appear

4. **Test Navigation**:
   - Click "My Communities" in header
   - Verify shows your communities first (My Communities tab)
   - Click "All Communities" tab
   - Verify shows all available schools

## Files Changed

### Backend
- `/server/prisma/schema.prisma` - Added Child, CommunityChild models, updated User
- `/server/src/controllers/communities.controller.ts` - Removed one-community restriction
- `/server/prisma/seed.ts` - Added Lake Nokomis schools

### Frontend
- `/client/src/components/communities/FindYourSchool.tsx` - Fixed browse button
- `/client/src/pages/Communities.tsx` - Reverted to multi-community view

## Database Schema Diagram

```
User
├── children: Child[]
├── communityMemberships: CommunityMember[]
└── privacy: showChildrenNames

Child
├── user: User
├── firstName: String
├── gradeLevel: String
└── communityChildren: CommunityChild[]

Community
├── members: CommunityMember[]
├── groups: Group[]
└── children: CommunityChild[]

CommunityChild (Junction Table)
├── community: Community
├── child: Child
└── addedAt: DateTime
```

## Implementation Priority

**Priority 1** (Must Have):
1. ✅ Remove one-community restriction
2. ✅ Fix browse button
3. ✅ Add missing schools
4. ✅ Update database schema
5. ⏳ Run database migration

**Priority 2** (High):
1. Add child entry modal when joining community
2. Update TypeScript types for Child/CommunityChild
3. Add children management to Profile page

**Priority 3** (Medium):
1. Privacy settings for children names
2. Show children on community detail page
3. Validation for grade levels (K-12)

**Priority 4** (Nice to Have):
1. Transfer child to different school
2. Archive child (graduated)
3. Multiple children in same grade/school
4. Suggest groups based on child's grade

## Benefits

1. **Realistic Use Case**: Many families have children at multiple schools
2. **Better Organization**: Track which child is at which school
3. **Privacy First**: Children's names hidden by default
4. **Coordination**: Room parents can see grades to organize classrooms
5. **Flexibility**: Add/remove children as they change schools
6. **Future Features**: Enable age-appropriate content, classroom matching

## Notes

- Child's last name is not stored for privacy
- Only first name and grade level tracked
- Grade level is stored as string (supports "K", "1st", "2nd", etc.)
- CommunityChild tracks when child was added to community
- Deleting child removes all CommunityChild associations
- Deleting community removes all CommunityChild associations (cascade)

## Summary

This update transforms The Village from a single-community platform to a multi-community platform that accommodates the reality of families with children at different schools. The addition of children management lays the groundwork for grade-specific groups, classroom organization, and privacy-conscious family networking.
