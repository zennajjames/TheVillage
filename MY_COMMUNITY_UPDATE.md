# My Community Update

## Overview

Restructured the Communities feature to focus on a single school community per user, with "My Community" as the primary view instead of browsing all communities.

## Changes Made

### 1. Updated Communities Page (`/client/src/pages/Communities.tsx`)

**Before**:
- Showed "All Communities" and "My Communities" tabs
- Users could be in multiple communities
- Focused on browsing and joining

**After**:
- Shows "My Community" as the main view
- Displays user's single school community with detailed information
- Includes:
  - Large community card with cover image
  - School name, location, address
  - Member/group/role statistics
  - "View Community" button to see groups
  - "Leave Community" button
  - Quick action buttons for browsing/creating groups
  - Small link at bottom to "Browse all communities"

**Key Features**:
- Automatically redirects to `/find-your-school` if user has no community
- Beautiful, focused UI showcasing the user's school
- Less prominent access to browse other communities

### 2. Created Browse Communities Page (`/client/src/pages/BrowseCommunities.tsx`)

**Purpose**:
- Less prominent page for browsing all available communities
- Allows users to switch schools if needed

**Features**:
- Grid view of all communities
- "Switch to This School" button (replaces "Join Community")
- Automatically removes user from current community when switching
- Back button to return to previous page
- Smaller, more compact community cards

### 3. Backend: One Community Per User Restriction (`/server/src/controllers/communities.controller.ts`)

**Updated `joinCommunity` function**:

```typescript
// Check if user is already in ANY community
const existingMemberships = await prisma.communityMember.findMany({
  where: { userId },
});

if (existingMemberships.length > 0) {
  const currentCommunity = existingMemberships[0];

  if (currentCommunity.communityId !== id) {
    // User is switching communities - remove from current one first
    await prisma.communityMember.delete({
      where: { id: currentCommunity.id },
    });
  } else {
    // Already a member of this community
    return res.status(400).json({ error: 'Already a member of this community' });
  }
}
```

**Logic**:
- When user tries to join a new community, automatically leaves current community first
- Enforces one-community-per-user rule at the database level
- Smooth switching experience without manual leaving required

### 4. Updated Navigation Labels

Changed "Communities" to "My Community" in all 4 languages:

**English**: `"communities": "My Community"`
**Spanish**: `"communities": "Mi Comunidad"`
**Somali**: `"communities": "Bulshadayda"`
**Hmong**: `"communities": "Kuv Zej Zog"`

### 5. Updated Routing (`/client/src/App.tsx`)

Added new route:
```typescript
<Route
  path="/browse-communities"
  element={
    <ProtectedRoute>
      <BrowseCommunities />
    </ProtectedRoute>
  }
/>
```

## User Experience Flow

### New User
1. Signs up → enters zip code
2. First login → Dashboard checks communities
3. No community → Redirect to `/find-your-school`
4. Searches by zip code → Finds school
5. Joins school → Now has one community
6. Future logins → Can click "My Community" to see their school

### Existing User
1. Clicks "My Community" in navigation
2. Sees their school with full details
3. Can view groups, create groups, or browse community
4. Can leave community if needed
5. Small link to browse other schools (less prominent)

### Switching Schools
1. User clicks "Browse all communities" link
2. Views all available schools in grid
3. Clicks "Switch to This School" on new school
4. Automatically removed from old school
5. Joined to new school
6. Redirected to "My Community" showing new school

## Benefits

1. **Focused Experience**: Users see their school prominently, not a list of all schools
2. **Simplified Navigation**: "My Community" is clearer than "Communities"
3. **One School Focus**: Aligns with the PTA/school community purpose
4. **Easy Switching**: Users can still switch schools, but it's a deliberate action
5. **Better Onboarding**: Clear path from signup → find school → view community
6. **Reduced Clutter**: No need to manage multiple communities
7. **Community-Centric**: Emphasizes belonging to YOUR school community

## Technical Details

### Files Created
- `/client/src/pages/BrowseCommunities.tsx` - Browse all communities page

### Files Modified
- `/client/src/pages/Communities.tsx` - Completely rewritten to show single community
- `/server/src/controllers/communities.controller.ts` - Added one-community restriction
- `/client/src/App.tsx` - Added browse-communities route
- `/client/src/i18n/locales/en.json` - Updated navigation label
- `/client/src/i18n/locales/es.json` - Updated navigation label
- `/client/src/i18n/locales/so.json` - Updated navigation label
- `/client/src/i18n/locales/hmn.json` - Updated navigation label

### Database Changes
None required - logic is enforced at the application level

### API Changes
- `POST /communities/:id/join` - Now automatically handles switching communities
- No breaking changes to API contracts

## Testing

### Manual Test Cases

1. **Test One Community Restriction**
   - Join school A
   - Try to join school B
   - Verify you're removed from A and added to B

2. **Test My Community Page**
   - Navigate to `/communities`
   - Verify you see your school details
   - Verify stats are displayed correctly
   - Click "View Community" - should navigate to detail page

3. **Test Browse Communities**
   - Click "Browse all communities" link
   - Verify grid of all schools appears
   - Verify current school shows "Your Current School"
   - Verify other schools show "Switch to This School"

4. **Test No Community Redirect**
   - Leave your community
   - Navigate to `/communities`
   - Verify redirect to `/find-your-school`

5. **Test Translation**
   - Switch language to Spanish
   - Verify navigation shows "Mi Comunidad"
   - Switch to Somali → "Bulshadayda"
   - Switch to Hmong → "Kuv Zej Zog"

## Future Enhancements

Possible improvements:

1. **Switch Confirmation**: Add confirmation dialog when switching schools
2. **Transfer History**: Track which schools user has been a member of
3. **Waiting Period**: Add cooldown period between school switches
4. **Admin Approval**: Require admin approval for certain schools
5. **School Suggestions**: Suggest schools based on user's location
6. **Invite System**: Allow schools to invite specific users

## Migration Notes

### For Existing Users with Multiple Communities

If there are existing users with multiple community memberships:

```sql
-- Find users with multiple communities
SELECT userId, COUNT(*) as community_count
FROM CommunityMember
GROUP BY userId
HAVING COUNT(*) > 1;

-- Optional: Keep only the most recent membership
DELETE FROM CommunityMember
WHERE id NOT IN (
  SELECT MAX(id)
  FROM CommunityMember
  GROUP BY userId
);
```

Run this migration before deploying to ensure all users have at most one community.

## Rollback Plan

If you need to revert these changes:

1. Revert backend changes to remove one-community restriction
2. Restore old Communities.tsx from git history
3. Remove BrowseCommunities.tsx
4. Revert translation keys to "Communities" / "Comunidades" / etc.
5. Remove `/browse-communities` route from App.tsx

## Summary

This update transforms The Village from a multi-community platform to a focused, single-school experience. Users now have "My Community" as their home base, with less prominent access to browse and switch schools if needed. This aligns better with the PTA/school community focus and provides a clearer, more intuitive user experience.
