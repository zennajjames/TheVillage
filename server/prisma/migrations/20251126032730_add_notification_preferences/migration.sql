-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailNotifications" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "notifyOnGroups" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "notifyOnMessages" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "notifyOnPosts" BOOLEAN NOT NULL DEFAULT true;
