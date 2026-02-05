-- CreateEnum
CREATE TYPE "TestimonialType" AS ENUM ('GENERAL', 'COURSE');

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "isRunning" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Institution" ADD COLUMN     "city" TEXT,
ADD COLUMN     "state" TEXT;

-- AlterTable
ALTER TABLE "Mentor" ADD COLUMN     "qoute" TEXT;

-- CreateTable
CREATE TABLE "CourseTool" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "toolId" TEXT NOT NULL,

    CONSTRAINT "CourseTool_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "country_code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Social" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Social_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Metrics" (
    "id" TEXT NOT NULL,
    "total_students" INTEGER NOT NULL,
    "total_workshops" INTEGER NOT NULL,
    "total_projects" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Testimonial" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT,
    "image" TEXT,
    "quote" TEXT NOT NULL,
    "type" "TestimonialType" NOT NULL DEFAULT 'GENERAL',
    "courseId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CourseTool_courseId_toolId_key" ON "CourseTool"("courseId", "toolId");

-- CreateIndex
CREATE INDEX "Testimonial_courseId_idx" ON "Testimonial"("courseId");

-- AddForeignKey
ALTER TABLE "CourseTool" ADD CONSTRAINT "CourseTool_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseTool" ADD CONSTRAINT "CourseTool_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "Tool"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Testimonial" ADD CONSTRAINT "Testimonial_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
