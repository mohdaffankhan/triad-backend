import type { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import {
  deleteOnCloudinary,
  uploadonCloudinary,
} from '../config/cloudinary.js';
import prisma from '../lib/prisma.js';
import { getPublicId } from '../lib/cloudinary.js';

const createMentor = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, experience, designation, linkedinUrl, quote } = req.body;
    const imagefile = req.file;

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
        quote,
        image: image?.secure_url || '',
      },
    });

    res.status(201).json(newMentor);
  } catch (error) {
    console.log(error);
    return next(createHttpError(500, 'Error while creating Mentor'));
  }
};

const deleteMentor = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const mentorId = req.params.mentorId;
  if (!mentorId || Array.isArray(mentorId)) {
    return next(createHttpError(400, 'Invalid mentor id'));
  }
  try {
    const mentor = await prisma.mentor.findUnique({ where: { id: mentorId } });
    if (!mentor) {
      return next(createHttpError(404, 'Mentor not found'));
    }

    if (mentor.image) {
      const publicId = getPublicId(mentor.image);
      if (!publicId) {
        return next(createHttpError(500, 'Error while deleting Mentor'));
      }
      await deleteOnCloudinary(publicId);
    }
    await prisma.mentor.delete({ where: { id: mentorId } });

    return res.status(200).json({
      message: 'Mentor deleted successfully',
    });
  } catch (error) {
    console.log(error);
    return next(createHttpError(500, 'Error while deleting Mentor'));
  }
};

const getAllMentor = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const mentors = await prisma.mentor.findMany();

    // Optional: only if you want 404 when no mentors exist
    if (mentors.length === 0) {
      return res.status(404).json({ message: 'No mentors found' });
    }

    return res.status(200).json(mentors);
  } catch (error) {
    console.log(error);
    return next(createHttpError(500, 'Error while getting all mentors'));
  }
};

export { createMentor, deleteMentor, getAllMentor };
