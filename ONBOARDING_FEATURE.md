# School Onboarding Feature

## Overview

Implemented a comprehensive onboarding flow that prompts new users to find and join their school community by zip code. The system includes 29 pre-seeded Minneapolis Public Schools.

## What Was Implemented

### 1. Database Seed Script (`/server/prisma/seed.ts`)

Created a comprehensive seed script that populates the database with:

- **29 Minneapolis Public Schools** including:
  - Elementary schools (K-5)
  - K-8 schools
  - Middle schools (6-8)
  - High schools (9-12)
  - Montessori schools
  - Specialty schools (STEM, STEAM, Performing Arts, etc.)

- **Coverage**: 14 different Minneapolis zip codes
  - 55403, 55404, 55405, 55406, 55407, 55408, 55409, 55410
  - 55411, 55413, 55414, 55417, 55418, 55419

- **System User**: Creates a system admin user to own the communities

**Key Features**:
- Uses `upsert` to prevent duplicates
- Safe to run multiple times
- Each school includes: name, description, address, zip code, location
- All schools are public by default (anyone can join)

### 2. Find Your School Component (`/client/src/components/communities/FindYourSchool.tsx`)

Created a beautiful, user-friendly component that:

**Features**:
- Clean, modern UI with gradient background
- Zip code search (5-digit validation)
- Real-time search results
- Displays school information:
  - Name and description
  - Address
  - Member count
  - Group count
- One-click "Join School" button
- Option to search different zip code
- Link to browse all communities
- Responsive design

**User Experience**:
- Welcome message personalizing the onboarding
- Clear instructions
- Error handling for no results
- Loading states
- Helpful fallback options

### 3. User Flow Updates (`/client/src/pages/Dashboard.tsx`)

Updated the Dashboard to:

1. **Check Community Membership**: On page load, check if user is in any communities
2. **Automatic Redirect**: If user has NO communities → redirect to `/find-your-school`
3. **Seamless Experience**: After joining a school, user returns to normal flow

**Logic**:
```typescript
const checkUserCommunities = async () => {
  const communities = await communitiesService.getUserCommunities();
  if (communities.length === 0) {
    navigate('/find-your-school');
  }
};
```

### 4. Routing Updates (`/client/src/App.tsx`)

Added new protected route:
```typescript
<Route
  path="/find-your-school"
  element={
    <ProtectedRoute>
      <FindYourSchool />
    </ProtectedRoute>
  }
/>
```

### 5. Package.json Script (`/server/package.json`)

Added convenient seed command:
```json
"seed": "ts-node prisma/seed.ts"
```

## How It Works

### New User Journey

1. **Sign Up**
   - User creates account with email, password, name, and **zip code**

2. **First Login**
   - User logs in for the first time
   - Dashboard loads and checks: `getUserCommunities()`

3. **Community Check**
   - If communities.length === 0 → Redirect to `/find-your-school`
   - If communities.length > 0 → Show normal dashboard

4. **Find School Page**
   - User sees welcome message
   - Enters their zip code (e.g., "55410")
   - Clicks "Search"

5. **Search Results**
   - System queries all communities by zip code
   - Displays matching schools with full details
   - User clicks "Join School" on their school

6. **Join School**
   - `communitiesService.joinCommunity(schoolId)` is called
   - User becomes a MEMBER of that community
   - Redirected to school's community detail page

7. **Future Logins**
   - User has communities now
   - Dashboard loads normally
   - Can explore groups, create posts, join classrooms

## Running the Seed

### Prerequisites
- PostgreSQL database running
- Database migrations completed
- Server dependencies installed

### Commands

```bash
# Navigate to server directory
cd server

# Run the seed script
npm run seed
```

### Expected Output
```
Starting seed...
System user created: system@thevillage.app
Creating Minneapolis Public Schools...
✓ Created: Anwatin Middle School
✓ Created: Anthony Middle School
...
✓ Created: Windom Elementary

✅ Successfully seeded 29 Minneapolis Public Schools
```

## Testing the Feature

### Manual Test Steps

1. **Seed the Database**
   ```bash
   cd server
   npm run seed
   ```

2. **Start the Servers**
   ```bash
   # Terminal 1 - Backend
   cd server
   npm run dev

   # Terminal 2 - Frontend
   cd client
   npm run dev
   ```

3. **Create a New User**
   - Go to http://localhost:5173/signup
   - Sign up with a Minneapolis zip code (e.g., 55410)

4. **Log In**
   - Should automatically redirect to `/find-your-school`

5. **Search for School**
   - Enter your zip code
   - Click "Search"
   - Verify schools appear

6. **Join a School**
   - Click "Join School" on any school
   - Should redirect to community detail page
   - Verify you're now a member

7. **Log Out and Back In**
   - Log out
   - Log back in
   - Should go to Dashboard (not find-your-school page)
   - Community check passes because you now have a community

## Files Created/Modified

### Created Files
- `/server/prisma/seed.ts` - Seed script with 29 schools
- `/client/src/components/communities/FindYourSchool.tsx` - Onboarding UI
- `/Users/zennajames/Repositories/the-village/SEEDING.md` - Seed documentation
- `/Users/zennajames/Repositories/the-village/ONBOARDING_FEATURE.md` - This file

### Modified Files
- `/server/package.json` - Added seed script
- `/client/src/App.tsx` - Added /find-your-school route
- `/client/src/pages/Dashboard.tsx` - Added community membership check

## Key Benefits

1. **Immediate Value**: New users can find and join their school instantly
2. **Real Schools**: 29 actual Minneapolis Public Schools with real addresses
3. **Scalable**: Easy to add more schools/districts
4. **User-Friendly**: Simple, beautiful UI with clear instructions
5. **Automatic**: No manual intervention needed - system handles everything
6. **Flexible**: Users can browse all communities if their zip code has no results

## Future Enhancements

Possible improvements:

1. **Multi-District Support**: Add schools from other districts (St. Paul, suburbs)
2. **School Verification**: Add email domain verification (e.g., @mpls.k12.mn.us)
3. **Admin Approval**: Make some schools private and require admin approval
4. **School Logos**: Add school logos/images to communities
5. **Geo-Location**: Auto-detect user's zip code from browser location
6. **School Search**: Allow searching by school name, not just zip code
7. **Invite Codes**: Allow schools to generate invite codes for private access

## Troubleshooting

### "No schools found for zip code X"
- Verify the seed script ran successfully
- Check that schools were created in the database
- Confirm the zip code exists in the seed data

### User keeps getting redirected to /find-your-school
- Check that the join operation succeeded
- Verify user has a CommunityMember record in the database
- Check browser console for API errors

### Seed script fails
- Ensure PostgreSQL is running
- Verify DATABASE_URL in .env is correct
- Check that migrations have been run
- Ensure ts-node is installed in devDependencies

## Summary

This feature provides a seamless onboarding experience for new users, helping them immediately find and connect with their school community. The implementation is production-ready, well-documented, and easily extensible to support more schools and districts.
