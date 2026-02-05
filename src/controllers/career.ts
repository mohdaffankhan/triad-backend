import type { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import prisma from '../lib/prisma.js';

const createCareer = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { title, description, location, type, featured, applyLink } =
      req.body || {};

    if (!title || !description || !location || !type || !applyLink) {
      return next(createHttpError(400, 'All required fields must be provided'));
    }

    const career = await prisma.career.create({
      data: {
        title,
        description,
        location,
        type,
        featured: Boolean(featured),
        applyLink,
      },
    });

    return res.status(201).json(career);
  } catch (error) {
    console.log(error);
    return next(createHttpError(500, 'Error while creating career'));
  }
};

export { createCareer };
