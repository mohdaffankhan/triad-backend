/*
  Warnings:

  - Added the required column `date` to the `Journey` table without a default value. This is not possible if the table is not empty.
  - Added the required column `icon` to the `Journey` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Journey" ADD COLUMN     "date" TEXT NOT NULL,
ADD COLUMN     "icon" TEXT NOT NULL,
ALTER COLUMN "coverImage" DROP NOT NULL;

-- CreateTable
CREATE TABLE "career" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "featured" BOOLEAN NOT NULL,
    "applyLink" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "career_pkey" PRIMARY KEY ("id")
);
