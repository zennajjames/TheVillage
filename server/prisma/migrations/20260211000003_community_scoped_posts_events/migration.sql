-- Add communityId to Post model (required)
-- First add as nullable, then we'll set a default for existing posts, then make NOT NULL
ALTER TABLE "Post" ADD COLUMN "communityId" TEXT;

-- For any existing posts, assign them to the first community of their author
-- If no community found, we'll leave NULL (these can be cleaned up manually)
UPDATE "Post" p
SET "communityId" = (
  SELECT cm."communityId"
  FROM "CommunityMember" cm
  WHERE cm."userId" = p."userId"
  ORDER BY cm."joinedAt" ASC
  LIMIT 1
);

-- If there are still posts without communityId (user has no communities), assign to first community in the system
UPDATE "Post"
SET "communityId" = (SELECT id FROM "Community" LIMIT 1)
WHERE "communityId" IS NULL;

-- Now make communityId NOT NULL
ALTER TABLE "Post" ALTER COLUMN "communityId" SET NOT NULL;

-- Add foreign key constraint
ALTER TABLE "Post" ADD CONSTRAINT "Post_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Add index
CREATE INDEX "Post_communityId_idx" ON "Post"("communityId");

-- Make Event.communityId required
-- First, set any NULL communityId events to the first community of their author
UPDATE "Event" e
SET "communityId" = (
  SELECT cm."communityId"
  FROM "CommunityMember" cm
  WHERE cm."userId" = e."userId"
  ORDER BY cm."joinedAt" ASC
  LIMIT 1
)
WHERE e."communityId" IS NULL;

-- If still NULL, assign to first community
UPDATE "Event"
SET "communityId" = (SELECT id FROM "Community" LIMIT 1)
WHERE "communityId" IS NULL;

-- Make NOT NULL
ALTER TABLE "Event" ALTER COLUMN "communityId" SET NOT NULL;
