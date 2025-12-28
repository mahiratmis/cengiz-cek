/*
  Warnings:

  - You are about to drop the column `firstName` on the `Staff` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `Staff` table. All the data in the column will be lost.
  - Added the required column `name` to the `Staff` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Staff` table without a default value. This is not possible if the table is not empty.
  - Made the column `branch` on table `Staff` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Staff" DROP COLUMN "firstName",
DROP COLUMN "lastName",
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "priority" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "role" DROP NOT NULL,
ALTER COLUMN "branch" SET NOT NULL;
