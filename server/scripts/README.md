# Split Campus Groups Migration

This script will split combined campus elementary school groups into separate groups for each campus.

## Schools to Split

The script will split these three Minneapolis Public Schools with multiple campuses:

1. **Lake Nokomis** → Wenonah (K-1) + Keewaydin (2-5)
2. **Hiawatha** → Hiawatha Campus (K-2) + Howe Campus (3-5)
3. **Lake Harriet** → Lower Campus (K-2) + Upper Campus (3-5)

## How to Run

```bash
cd /Users/zennajames/Repositories/the-village/server
npx ts-node scripts/split-campus-groups.ts
```

## What the Script Does

1. Searches for existing groups matching the combined names (e.g., "Lake Nokomis")
2. Creates new groups for each campus with:
   - Specific campus name and grades
   - Campus-specific address
   - Same category and privacy settings as original
   - Same creator
3. Transfers all members from the original group to BOTH new campus groups
4. Preserves the original combined group (you can delete it manually later)

## After Running

1. Review the newly created campus groups in your app
2. Manually delete the old combined groups if everything looks good
3. Members will be in both campus groups, allowing them to choose which one(s) to stay in

## Safety Notes

- The script will NOT delete the original combined groups
- If a campus group already exists, it will skip creating it
- All existing members will be copied to the new campus groups
- The script is idempotent - you can run it multiple times safely
