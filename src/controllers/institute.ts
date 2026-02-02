import type { NextFunction, Request, Response } from 'express';
import prisma from '../lib/prisma.js';
import createHttpError from 'http-errors';
import { getPublicId } from '../lib/cloudinary.js';
import {
  deleteOnCloudinary,
  uploadonCloudinary,
} from '../config/cloudinary.js';

const createInstitution = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name } = req.body;
    const logoFile = req.file;

    if (!name) {
      return next(createHttpError(400, 'Institution name is required'));
    }

    if (!logoFile) {
      return next(createHttpError(400, 'Institution logo is required'));
    }

    const logo = await uploadonCloudinary(logoFile.path, {
      folder: 'institutions',
    });

    if (!logo) {
      return next(createHttpError(500, 'Logo upload failed'));
    }

    const institution = await prisma.institution.create({
      data: {
        name,
        logo: logo.secure_url,
      },
    });

    return res.status(201).json(institution);
  } catch (error) {
    console.log(error);
    return next(createHttpError(500, 'Error while creating institution'));
  }
};

export { createInstitution };
