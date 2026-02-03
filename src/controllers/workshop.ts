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

const updateWorkshop = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;

  if (!id || Array.isArray(id)) {
    return next(createHttpError(400, 'Workshop id is required'));
  }

  try {
    const workshop = await prisma.workshop.findUnique({
      where: { id },
    });

    if (!workshop) {
      return next(createHttpError(404, 'Workshop not found'));
    }

    const data: any = {};
    const body = req.body || {};

    if (body.name) data.name = body.name;
    if (body.description) data.description = body.description;
    if (body.category) data.category = body.category;
    if (body.venue) data.venue = body.venue;
    if (body.date) data.date = body.date;

    // SAFE image replacement
    if (req.file) {
      // 1. Upload new image
      const newImage = await uploadonCloudinary(req.file.path, {
        folder: 'workshops',
      });

      if (!newImage) {
        return next(createHttpError(500, 'Image upload failed'));
      }

      data.coverImage = newImage.secure_url;
    }

    // 2. Update DB
    const updatedWorkshop = await prisma.workshop.update({
      where: { id },
      data,
    });

    // 3. Delete old image AFTER DB update
    if (req.file && workshop.coverImage) {
      const oldPublicId = getPublicId(workshop.coverImage);
      if (oldPublicId) {
        await deleteOnCloudinary(oldPublicId);
      }
    }

    return res.status(200).json(updatedWorkshop);
  } catch (error) {
    console.log(error);
    return next(createHttpError(500, 'Error while updating workshop'));
  }
};

export { createWorkshop, getAllWorkshops, updateWorkshop };
