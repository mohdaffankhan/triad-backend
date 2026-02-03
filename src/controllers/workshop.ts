import type { NextFunction, Request, Response } from 'express';
import prisma from '../lib/prisma.js';
import createHttpError from 'http-errors';
import {
  deleteOnCloudinary,
  uploadonCloudinary,
} from '../config/cloudinary.js';
import { getPublicId } from '../lib/cloudinary.js';

const createWorkshop = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, description, category, venue, date } = req.body;
    const coverImageFile = req.file;

    if (!name || !description || !category || !venue || !date) {
      return next(createHttpError(400, 'All fields are required'));
    }

    if (!coverImageFile) {
      return next(createHttpError(400, 'Cover image is required'));
    }

    const image = await uploadonCloudinary(coverImageFile.path, {
      folder: 'workshops',
    });

    if (!image) {
      return next(createHttpError(500, 'Image upload failed'));
    }

    const workshop = await prisma.workshop.create({
      data: {
        name,
        description,
        category,
        venue,
        date,
        coverImage: image.secure_url,
      },
    });

    return res.status(201).json(workshop);
  } catch (error) {
    console.log(error);
    return next(createHttpError(500, 'Error while creating workshop'));
  }
};

const getAllWorkshops = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const workshops = await prisma.workshop.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json(workshops);
  } catch (error) {
    console.log(error);
    return next(createHttpError(500, 'Error while getting workshops'));
  }
};

export { createWorkshop, getAllWorkshops };
