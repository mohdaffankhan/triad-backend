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

    const imageFile = req.file;

    if (!name || !experience || !designation || !linkedinUrl || !quote) {
      return next(createHttpError(400, 'All mentor fields are required'));
    }

    if (!imageFile) {
      return next(createHttpError(400, 'Image is required'));
    }

    const image = await uploadonCloudinary(imageFile.path, {
      folder: 'mentors',
    });

    if (!image) {
      return next(createHttpError(500, 'Image upload failed'));
    }

    const mentor = await prisma.mentor.create({
      data: {
        name,
        experience,
        designation,
        linkedinUrl,
        quote,
        image: image?.secure_url || '',
      },
    });

    return res.status(201).json(mentor);
  } catch (error) {
    console.error(error);
    return next(createHttpError(500, 'Error while creating mentor'));
  }
};

const getAllMentors = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const mentors = await prisma.mentor.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json(mentors);
  } catch (error) {
    console.error(error);
    return next(createHttpError(500, 'Error while fetching mentors'));
  }
};

const updateMentor = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { mentorId } = req.params;

  if (!mentorId || Array.isArray(mentorId)) {
    return next(createHttpError(400, 'Mentor id is required'));
  }

  try {
    const mentor = await prisma.mentor.findUnique({
      where: { id: mentorId },
    });

    if (!mentor) {
      return next(createHttpError(404, 'Mentor not found'));
    }

    const data: Record<string, any> = {};
    const { name, experience, designation, linkedinUrl, qoute } =
      req.body || {};

    if (name) data.name = name;
    if (experience) data.experience = experience;
    if (designation) data.designation = designation;
    if (linkedinUrl) data.linkedinUrl = linkedinUrl;
    if (qoute) data.qoute = qoute;

    // SAFE image replacement
    if (req.file) {
      const newImage = await uploadonCloudinary(req.file.path, {
        folder: 'mentors',
      });

      if (!newImage) {
        return next(createHttpError(500, 'Image upload failed'));
      }

      data.image = newImage.secure_url;
    }

    // Update DB first
    const updatedMentor = await prisma.mentor.update({
      where: { id: mentorId },
      data,
    });

    // Delete old image AFTER DB update
    if (req.file && mentor.image) {
      const oldPublicId = getPublicId(mentor.image);
      if (oldPublicId) {
        await deleteOnCloudinary(oldPublicId);
      }
    }

    return res.status(200).json(updatedMentor);
  } catch (error) {
    console.error(error);
    return next(createHttpError(500, 'Error while updating mentor'));
  }
};

const deleteMentor = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { mentorId } = req.params;

  if (!mentorId || Array.isArray(mentorId)) {
    return next(createHttpError(400, 'Invalid mentor id'));
  }

  try {
    const mentor = await prisma.mentor.findUnique({
      where: { id: mentorId },
    });

    if (!mentor) {
      return next(createHttpError(404, 'Mentor not found'));
    }

    // Delete image from Cloudinary
    if (mentor.image) {
      const publicId = getPublicId(mentor.image);
      if (publicId) {
        await deleteOnCloudinary(publicId);
      }
    }

    await prisma.mentor.delete({
      where: { id: mentorId },
    });

    return res.status(200).json({
      message: 'Mentor deleted successfully',
    });
  } catch (error) {
    console.error(error);
    return next(createHttpError(500, 'Error while deleting mentor'));
  }
};

export { createMentor, getAllMentors, updateMentor, deleteMentor };
