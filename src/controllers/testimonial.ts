import type { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import prisma from '../lib/prisma.js';

/**
 * GET /testimonials
 * Supports: limit, type, courseId
 */
const getTestimonials = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const limitParam = Number(req.query.limit);
    const take =
      Number.isInteger(limitParam) && limitParam > 0 ? limitParam : undefined;

    const { type, courseId } = req.query;

    const where: any = {};
    if (type) where.type = type;
    if (courseId) where.courseId = courseId;

    const testimonials = await prisma.testimonial.findMany({
      where,
      ...(take ? { take } : {}),
      orderBy: { createdAt: 'desc' },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            coverImage: true,
          },
        },
      },
    });

    return res.status(200).json(testimonials);
  } catch (error) {
    console.error(error);
    return next(createHttpError(500, 'Error while fetching testimonials'));
  }
};

export { getTestimonials };
