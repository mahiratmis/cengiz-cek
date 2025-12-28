/*
  Warnings:

  - You are about to drop the column `endDate` on the `Announcement` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Announcement` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Announcement" DROP COLUMN "endDate",
DROP COLUMN "startDate",
ADD COLUMN     "coverImage" TEXT,
ADD COLUMN     "publishAt" TIMESTAMP(3),
ADD COLUMN     "summary" TEXT;
