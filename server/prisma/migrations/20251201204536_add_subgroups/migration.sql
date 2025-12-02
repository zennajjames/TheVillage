/*
  Warnings:

  - You are about to drop the column `allowMessages` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `showAddress` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `showEmail` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `street` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "allowMessages",
DROP COLUMN "city",
DROP COLUMN "showAddress",
DROP COLUMN "showEmail",
DROP COLUMN "state",
DROP COLUMN "street";

-- CreateTable
CREATE TABLE "SubGroup" (
    "id" TEXT NOT NULL,
    "parentGroupId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "teacherName" TEXT,
    "grade" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubGroupMember" (
    "id" TEXT NOT NULL,
    "subGroupId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubGroupMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SubGroup_parentGroupId_idx" ON "SubGroup"("parentGroupId");

-- CreateIndex
CREATE INDEX "SubGroup_teacherName_idx" ON "SubGroup"("teacherName");

-- CreateIndex
CREATE INDEX "SubGroup_grade_idx" ON "SubGroup"("grade");

-- CreateIndex
CREATE INDEX "SubGroupMember_subGroupId_idx" ON "SubGroupMember"("subGroupId");

-- CreateIndex
CREATE INDEX "SubGroupMember_userId_idx" ON "SubGroupMember"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SubGroupMember_subGroupId_userId_key" ON "SubGroupMember"("subGroupId", "userId");

-- AddForeignKey
ALTER TABLE "SubGroup" ADD CONSTRAINT "SubGroup_parentGroupId_fkey" FOREIGN KEY ("parentGroupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubGroupMember" ADD CONSTRAINT "SubGroupMember_subGroupId_fkey" FOREIGN KEY ("subGroupId") REFERENCES "SubGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
