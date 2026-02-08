/*
  Warnings:

  - Added the required column `total_cities` to the `Metrics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_content_hours` to the `Metrics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_courses` to the `Metrics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_institutes` to the `Metrics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_mentors` to the `Metrics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_states` to the `Metrics` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Metrics" ADD COLUMN     "total_cities" INTEGER NOT NULL,
ADD COLUMN     "total_content_hours" INTEGER NOT NULL,
ADD COLUMN     "total_courses" INTEGER NOT NULL,
ADD COLUMN     "total_institutes" INTEGER NOT NULL,
ADD COLUMN     "total_mentors" INTEGER NOT NULL,
ADD COLUMN     "total_states" INTEGER NOT NULL,
ALTER COLUMN "id" SET DEFAULT 'singleton';
