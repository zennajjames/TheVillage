-- CreateEnum
CREATE TYPE "RequestVisibility" AS ENUM ('PUBLIC', 'SEMI_ANONYMOUS', 'ADMIN_ONLY');

-- AlterEnum
ALTER TYPE "NotificationType" ADD VALUE 'HELP_REQUEST';

-- CreateTable
CREATE TABLE "HelpRequest" (
    "id" TEXT NOT NULL,
    "communityId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "visibility" "RequestVisibility" NOT NULL DEFAULT 'PUBLIC',
    "status" "PostStatus" NOT NULL DEFAULT 'OPEN',
    "proxyPostId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HelpRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HelpRequest_proxyPostId_key" ON "HelpRequest"("proxyPostId");

-- CreateIndex
CREATE INDEX "HelpRequest_communityId_idx" ON "HelpRequest"("communityId");

-- CreateIndex
CREATE INDEX "HelpRequest_userId_idx" ON "HelpRequest"("userId");

-- CreateIndex
CREATE INDEX "HelpRequest_status_idx" ON "HelpRequest"("status");

-- CreateIndex
CREATE INDEX "HelpRequest_visibility_idx" ON "HelpRequest"("visibility");

-- AddForeignKey
ALTER TABLE "HelpRequest" ADD CONSTRAINT "HelpRequest_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HelpRequest" ADD CONSTRAINT "HelpRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
