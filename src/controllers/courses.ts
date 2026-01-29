import type { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import prisma from '../lib/prisma.js';
import { uploadonCloudinary } from '../config/cloudinary.js';

const createCourse = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      title,
      category,
      description,
      durationDays,
      level,
      commitmentHours,
      originalPrice,
      discountedPrice,
      features,
    } = req.body;

    const coverImageFile = req.file;

    if (!coverImageFile) {
      return next(createHttpError(400, 'Cover image is required'));
    }

    const image = await uploadonCloudinary(coverImageFile.path, {
      folder: 'courses',
    });

    if (!image) {
      return next(createHttpError(500, 'Image upload failed'));
    }

    // Parse features
    let parsedFeatures: string[] = [];

    if (typeof features === 'string') {
      try {
        // If frontend sends JSON: '["Feature 1","Feature 2"]'
        parsedFeatures = JSON.parse(features);
      } catch {
        // If frontend sends: "Feature 1, Feature 2"
        parsedFeatures = features.split(',').map((f) => f.trim());
      }
    }

    const course = await prisma.course.create({
      data: {
        title,
        coverImage: image.secure_url,
        category,
        description,
        durationDays: Number(durationDays),
        level,
        commitmentHours: Number(commitmentHours),
        originalPrice: Number(originalPrice),
        discountedPrice: Number(discountedPrice),
        features: parsedFeatures,
      },
    });

    return res.status(201).json(course);
  } catch (error) {
    console.error(error);
    return next(createHttpError(500, 'Error while creating course'));
  }
};

const getCourseById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { courseId } = req.params;

  if (!courseId || Array.isArray(courseId)) {
    return next(createHttpError(400, "Course id is required"));
  }

  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return next(createHttpError(404, "Course not found"));
    }

    return res.status(200).json(course);
  } catch (error) {
    console.log(error);
    return next(createHttpError(500, "Error while fetching course"));
  }
};


export { createCourse, getCourseById };
