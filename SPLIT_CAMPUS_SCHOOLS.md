# Split Campus Schools Update

## Overview

Added support for Minneapolis schools with multiple campuses. Some schools have separate buildings for different grade ranges, and parents need to be able to join the specific campus their child attends.

## Schools Added/Updated

### 1. Lake Harriet Community School → Split into 2 Campuses

**Before**: Single "Lake Harriet Community School" (K-8)

**After**:
- **Lake Harriet - Lower Campus** (K-3)
  - Address: 4912 Vincent Ave S
  - Zip: 55410

- **Lake Harriet - Upper Campus** (4-8)
  - Address: 4944 Chowen Ave S
  - Zip: 55410

### 2. Hale STEM School → Split into 2 Campuses

**Before**: Single "Hale STEM School" (K-8)

**After**:
- **Hale STEM School - Lower Campus** (K-2)
  - Address: 4959 Green Ave S
  - Zip: 55410

- **Hale STEM School - Upper Campus** (3-8)
  - Address: 4901 Green Ave S
  - Zip: 55410

### 3. Field Elementary → Added 2 Campuses (NEW)

**Added**:
- **Field Elementary - Lower Campus** (K-2)
  - Address: 4645 4th Ave S
  - Zip: 55419

- **Field Elementary - Upper Campus** (3-5)
  - Address: 4655 4th Ave S
  - Zip: 55419

### 4. Lake Nokomis Schools → Already Split (from previous update)

- **Lake Nokomis - Wenonah** (K-5)
  - Address: 5625 30th Ave S
  - Zip: 55417

- **Lake Nokomis - Keewaydin** (K-5)
  - Address: 5209 30th Ave S
  - Zip: 55417

## Total Schools

**Previous**: 29 Minneapolis schools
**Added**:
- 2 Field campuses (new school)
- 1 Lake Harriet campus (split from 1 to 2)
- 1 Hale campus (split from 1 to 2)

**New Total**: 37 Minneapolis Public Schools

## Naming Convention

Split campus schools use the format:
```
[School Name] - [Campus Name]
```

Examples:
- Lake Harriet - Lower Campus
- Hale STEM School - Upper Campus
- Field Elementary - Lower Campus

This makes it clear:
1. Which school family it belongs to
2. Which specific campus/building
3. Which grades are served

## Why This Matters

### Parent Experience

**Scenario 1: Single Child**
- Parent has child in 2nd grade at Hale Lower Campus
- Joins "Hale STEM School - Lower Campus"
- Gets relevant information for K-2 families only

**Scenario 2: Multiple Children at Same School**
- Parent has one child in 1st grade (Lower) and one in 4th grade (Upper)
- Joins BOTH "Hale STEM School - Lower Campus" AND "Hale STEM School - Upper Campus"
- Receives information for both campuses
- Can join different groups/classrooms for each campus

**Scenario 3: Transition Year**
- Child moving from Lower to Upper campus
- Parent remains in both communities during transition
- Can coordinate with both sets of families

### Community Management

- **Separate PTAs**: Some split campuses have separate PTA organizations
- **Different Events**: Lower and Upper campuses often have different event schedules
- **Campus-Specific Groups**: Room parents, carpools, and activities are campus-specific
- **Building-Specific Info**: Different pickup/dropoff procedures, contacts, etc.

## Implementation

### Database

No schema changes required. Each campus is a separate `Community` record.

### Seed Script

**File**: `/server/prisma/seed.ts`

Changes:
1. Replaced single Lake Harriet entry with Lower/Upper campuses
2. Replaced single Hale entry with Lower/Upper campuses
3. Added Field Lower/Upper campuses

### User Experience

1. **Search by Zip Code**:
   - User searches 55410
   - Sees both Hale Lower and Hale Upper (and Lake Harriet Lower/Upper)
   - Can join the appropriate campus(es)

2. **My Communities Page**:
   - Shows all campuses user has joined
   - Each campus appears as separate card
   - Clear labeling shows which is which

3. **Groups Within Campus**:
   - Each campus has its own set of groups
   - Classrooms are campus-specific
   - Parents connect with families at the same building

## Testing

### Manual Test Cases

1. **Test Split Campus Search**:
   ```bash
   - Search zip code 55410
   - Verify both Hale campuses appear
   - Verify both Lake Harriet campuses appear
   - Verify clear labeling (Lower/Upper)
   ```

2. **Test Multiple Campus Membership**:
   ```bash
   - Join Hale Lower Campus
   - Join Hale Upper Campus
   - Navigate to "My Communities"
   - Verify both appear
   - Click each one - verify they're distinct communities
   ```

3. **Test Field School**:
   ```bash
   - Search zip code 55419
   - Verify both Field campuses appear
   - Join one
   - Verify it appears in My Communities
   ```

## Running the Update

```bash
cd server
npm run seed
```

This will add the new schools and update the existing split campuses.

## Benefits

✅ **Accurate Representation**: Matches real-world school structure
✅ **Targeted Communication**: Campus-specific announcements and events
✅ **Better Organization**: Separate groups for each campus
✅ **Multiple Children Support**: Parents can join both campuses
✅ **Transition Support**: Families can belong to both during transition years
✅ **PTA Alignment**: Matches how schools actually organize their PTAs

## Future Considerations

### Potential Features

1. **Campus Linking**: Mark communities as "same school family"
   - Could show "Also see: Hale - Upper Campus" on Lower Campus page
   - Useful for families planning ahead

2. **Transfer Assistance**: Help when child moves from Lower to Upper
   - Suggest joining Upper campus
   - Maintain connections from Lower campus

3. **Combined Events**: Some events are whole-school
   - Flag certain events as "All Campuses"
   - Cross-post to both communities

4. **Sibling Connections**: Show which families have kids at both campuses
   - Strengthen cross-campus connections
   - Useful for carpools that serve both buildings

## Notes

- Each campus is treated as a completely separate community
- No technical link between Lower and Upper campuses in database
- Parents manually join each campus they need
- This approach is flexible and matches how schools actually operate
- If a school merges campuses in future, communities can be archived

## Summary

This update adds 8 new school entries (6 split campuses + 2 Field campuses) to accurately represent Minneapolis schools with multiple buildings. The total number of schools increases from 29 to 37, providing better service to families whose children attend split-campus schools.
