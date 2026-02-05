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

const getAllCareers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const careers = await prisma.career.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json(careers);
  } catch (error) {
    console.log(error);
    return next(createHttpError(500, 'Error while fetching careers'));
  }
};

const getCareerById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;

  if (!id || Array.isArray(id)) {
    return next(createHttpError(400, 'Career id is required'));
  }

  try {
    const career = await prisma.career.findUnique({
      where: { id },
    });

    if (!career) {
      return next(createHttpError(404, 'Career not found'));
    }

    return res.status(200).json(career);
  } catch (error) {
    console.log(error);
    return next(createHttpError(500, 'Error while fetching career'));
  }
};

const getFeaturedCareers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const careers = await prisma.career.findMany({
      where: { featured: true },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json(careers);
  } catch (error) {
    console.log(error);
    return next(createHttpError(500, 'Error while fetching featured careers'));
  }
};

export { createCareer, getAllCareers, getCareerById, getFeaturedCareers };
