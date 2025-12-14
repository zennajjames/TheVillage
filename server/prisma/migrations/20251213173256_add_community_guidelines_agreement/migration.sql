-- AlterTable: Add community guidelines agreement fields to User
ALTER TABLE "User" ADD COLUMN "agreedToGuidelines" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "User" ADD COLUMN "guidelinesAgreedAt" TIMESTAMP(3);
