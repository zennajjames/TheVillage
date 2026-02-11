-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('PENDING_REVIEW', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT,
    "address" TEXT,
    "zipCode" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "communityId" TEXT,
    "userId" TEXT NOT NULL,
    "status" "EventStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
    "adminNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Event_userId_idx" ON "Event"("userId");
CREATE INDEX "Event_communityId_idx" ON "Event"("communityId");
CREATE INDEX "Event_status_idx" ON "Event"("status");
CREATE INDEX "Event_startDate_idx" ON "Event"("startDate");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Event" ADD CONSTRAINT "Event_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Set Zenna James as admin
UPDATE "User" SET "isAdmin" = true WHERE "firstName" = 'Zenna' AND "lastName" = 'James';
