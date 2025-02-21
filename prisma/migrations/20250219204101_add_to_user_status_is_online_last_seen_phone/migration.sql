/*
  Warnings:

  - Added the required column `lastSeen` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isOnline" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastSeen" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "phone" INTEGER,
ADD COLUMN     "status" TEXT;
