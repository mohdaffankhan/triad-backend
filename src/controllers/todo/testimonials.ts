import type { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import prisma from '../../lib/prisma.js';

const getTestimonials = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { limit } = req.query;
    const take = limit ? Number(limit) : undefined;

    const testimonials = await prisma.testimonials.findMany({
      take,
      include: {
        course: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json(testimonials);
  } catch (error) {
    console.log(error);
    return next(createHttpError(500, 'Error while fetching testimonials'));
  }
};

export { getTestimonials };
