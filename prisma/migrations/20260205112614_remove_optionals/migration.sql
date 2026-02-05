/*
  Warnings:

  - Made the column `city` on table `Institution` required. This step will fail if there are existing NULL values in that column.
  - Made the column `state` on table `Institution` required. This step will fail if there are existing NULL values in that column.
  - Made the column `qoute` on table `Mentor` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Institution" ALTER COLUMN "city" SET NOT NULL,
ALTER COLUMN "state" SET NOT NULL;

-- AlterTable
ALTER TABLE "Mentor" ALTER COLUMN "qoute" SET NOT NULL;
