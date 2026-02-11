-- Phase 1: Consolidate Groups into Communities
-- This migration removes the Group/GroupMember/GroupPost tables and moves everything into Community

-- Step 1: Add category column to Community
ALTER TABLE "Community" ADD COLUMN "category" TEXT;

-- Step 2: Create CommunityPost table (mirrors GroupPost)
CREATE TABLE "CommunityPost" (
    "id" TEXT NOT NULL,
    "communityId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "images" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "CommunityPost_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "CommunityPost_communityId_idx" ON "CommunityPost"("communityId");
CREATE INDEX "CommunityPost_createdAt_idx" ON "CommunityPost"("createdAt");
ALTER TABLE "CommunityPost" ADD CONSTRAINT "CommunityPost_communityId_fkey"
    FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Step 3: Set category = 'Neighborhood' on existing communities that have a matching neighborhood group
UPDATE "Community" c
SET "category" = 'Neighborhood'
FROM "Group" g
WHERE g."communityId" = c."id"
  AND g."category" = 'Neighborhood';

-- Step 4: Insert school groups as new Community records
-- We reuse the Group's id so SubGroup parentGroupId values remain valid
INSERT INTO "Community" ("id", "name", "description", "location", "address", "zipCode", "coverImage", "isPrivate", "createdById", "category", "createdAt", "updatedAt")
SELECT
    g."id",
    g."name",
    g."description",
    c."location",
    c."address",
    c."zipCode",
    g."coverImage",
    g."isPrivate",
    g."createdById",
    'School',
    g."createdAt",
    g."updatedAt"
FROM "Group" g
JOIN "Community" c ON g."communityId" = c."id"
WHERE g."category" = 'School'
ON CONFLICT ("name", "zipCode") DO UPDATE SET "category" = 'School';

-- Step 5: Insert any other group categories as new Community records
INSERT INTO "Community" ("id", "name", "description", "location", "address", "zipCode", "coverImage", "isPrivate", "createdById", "category", "createdAt", "updatedAt")
SELECT
    g."id",
    g."name",
    g."description",
    c."location",
    c."address",
    c."zipCode",
    g."coverImage",
    g."isPrivate",
    g."createdById",
    NULL,
    g."createdAt",
    g."updatedAt"
FROM "Group" g
JOIN "Community" c ON g."communityId" = c."id"
WHERE g."category" NOT IN ('School', 'Neighborhood')
ON CONFLICT ("name", "zipCode") DO NOTHING;

-- Step 6: Migrate GroupMember -> CommunityMember
-- For school groups and other groups that became new communities (reused IDs):
INSERT INTO "CommunityMember" ("id", "communityId", "userId", "role", "joinedAt")
SELECT
    gen_random_uuid(),
    gm."groupId",
    gm."userId",
    gm."role",
    gm."joinedAt"
FROM "GroupMember" gm
JOIN "Group" g ON gm."groupId" = g."id"
WHERE g."category" = 'School'
ON CONFLICT ("communityId", "userId") DO NOTHING;

-- For neighborhood groups, members go to the parent community:
INSERT INTO "CommunityMember" ("id", "communityId", "userId", "role", "joinedAt")
SELECT
    gen_random_uuid(),
    g."communityId",
    gm."userId",
    gm."role",
    gm."joinedAt"
FROM "GroupMember" gm
JOIN "Group" g ON gm."groupId" = g."id"
WHERE g."category" = 'Neighborhood'
ON CONFLICT ("communityId", "userId") DO NOTHING;

-- For other group types that became new communities:
INSERT INTO "CommunityMember" ("id", "communityId", "userId", "role", "joinedAt")
SELECT
    gen_random_uuid(),
    gm."groupId",
    gm."userId",
    gm."role",
    gm."joinedAt"
FROM "GroupMember" gm
JOIN "Group" g ON gm."groupId" = g."id"
WHERE g."category" NOT IN ('School', 'Neighborhood')
ON CONFLICT ("communityId", "userId") DO NOTHING;

-- Step 7: Migrate GroupPost -> CommunityPost
INSERT INTO "CommunityPost" ("id", "communityId", "userId", "content", "images", "createdAt", "updatedAt")
SELECT
    gp."id",
    CASE
        WHEN g."category" = 'Neighborhood' THEN g."communityId"
        ELSE g."id"
    END,
    gp."userId",
    gp."content",
    gp."images",
    gp."createdAt",
    gp."updatedAt"
FROM "GroupPost" gp
JOIN "Group" g ON gp."groupId" = g."id";

-- Step 8: Re-parent SubGroup from Group to Community
ALTER TABLE "SubGroup" ADD COLUMN "parentCommunityId" TEXT;

-- School groups became communities with same ID
UPDATE "SubGroup" sg
SET "parentCommunityId" = sg."parentGroupId"
FROM "Group" g
WHERE sg."parentGroupId" = g."id"
  AND g."category" = 'School';

-- Neighborhood groups -> point to parent community
UPDATE "SubGroup" sg
SET "parentCommunityId" = g."communityId"
FROM "Group" g
WHERE sg."parentGroupId" = g."id"
  AND g."category" = 'Neighborhood';

-- Other groups that became new communities (same ID reuse)
UPDATE "SubGroup" sg
SET "parentCommunityId" = sg."parentGroupId"
FROM "Group" g
WHERE sg."parentGroupId" = g."id"
  AND g."category" NOT IN ('School', 'Neighborhood');

-- Handle any remaining (fallback)
UPDATE "SubGroup" sg
SET "parentCommunityId" = sg."parentGroupId"
WHERE sg."parentCommunityId" IS NULL;

-- Drop old SubGroup foreign key and column
ALTER TABLE "SubGroup" DROP CONSTRAINT "SubGroup_parentGroupId_fkey";
DROP INDEX "SubGroup_parentGroupId_idx";
ALTER TABLE "SubGroup" DROP COLUMN "parentGroupId";

-- Make parentCommunityId required and add FK
ALTER TABLE "SubGroup" ALTER COLUMN "parentCommunityId" SET NOT NULL;
ALTER TABLE "SubGroup" ADD CONSTRAINT "SubGroup_parentCommunityId_fkey"
    FOREIGN KEY ("parentCommunityId") REFERENCES "Community"("id") ON DELETE CASCADE ON UPDATE CASCADE;
CREATE INDEX "SubGroup_parentCommunityId_idx" ON "SubGroup"("parentCommunityId");

-- Step 9: Rename Notification column
ALTER TABLE "Notification" RENAME COLUMN "relatedGroupId" TO "relatedCommunityId";

-- Step 10: Rename notification enum values
ALTER TYPE "NotificationType" RENAME VALUE 'GROUP_POST' TO 'COMMUNITY_POST';
ALTER TYPE "NotificationType" RENAME VALUE 'GROUP_INVITE' TO 'COMMUNITY_INVITE';

-- Step 11: Rename User column
ALTER TABLE "User" RENAME COLUMN "notifyOnGroups" TO "notifyOnCommunities";

-- Step 12: Drop Group-related tables (order matters for FKs)
DROP TABLE "GroupPost";
DROP TABLE "GroupMember";
DROP TABLE "Group";

-- Step 13: Add index on Community.category
CREATE INDEX "Community_category_idx" ON "Community"("category");
