import type { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import { uploadonCloudinary } from '../config/cloudinary.js';
import path from 'node:path';
import prisma from '../lib/prisma.js';
import fs from 'node:fs';

const createMentor = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, experience, designation, linkedinUrl } = req.body;
    const imagefile = req.file
    console.log('req.file:', req.file);
    console.log('req.body:', req.body);

    if (!imagefile) {
      return next(createHttpError(400, 'Image is required'));
    }

    // upload cover image
    const filepath = imagefile.path;
    const image = await uploadonCloudinary(filepath);

    const newMentor = await prisma.mentor.create({
      data: {
        name,
        experience,
        designation,
        linkedinUrl,
        image: image?.secure_url || '',
      },
    });

    res.status(201).json(newMentor);
  } catch (error) {
    console.log(error);
    return next(createHttpError(500, 'Error while creating Mentor'));
  }
};

export { createMentor };
