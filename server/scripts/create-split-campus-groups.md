# Minneapolis Split Campus Schools

Based on Minneapolis Public Schools information, here are the known split campus elementary schools:

## Confirmed Split Campus Schools:

### 1. Lake Nokomis Elementary School
- **Wenonah Campus (K-1)** - 5625 23rd Avenue South
- **Keewaydin Campus (2-5)** - 5209 30th Avenue South

### 2. Hiawatha Elementary School
- **Hiawatha Campus (K-2)** - 4201 42nd Avenue South
- **Howe Campus (3-5)** - 3733 43rd Avenue South

### 3. Lake Harriet Elementary School
- **Lower Campus (K-2)** - 4030 Chowen Avenue South
- **Upper Campus (3-5)** - 4912 Vincent Avenue South

## To Run the Migration:

1. Update the `split-campus-groups.ts` file with all split campus schools
2. Run the script:
   ```bash
   cd server
   npx ts-node scripts/split-campus-groups.ts
   ```

3. The script will:
   - Find each combined group
   - Create separate groups for each campus
   - Transfer all members to both new campus groups
   - Preserve the original combined group (you can delete manually)

## Manual Deletion (Optional):

After verifying the new campus groups are correct, you can manually delete the combined groups through:
- Prisma Studio: `npx prisma studio`
- Or through the app's admin interface
