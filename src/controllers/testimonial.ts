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
  const { type, courseId, limit = '10', page = '1' } = req.query;

  const take = Math.min(Number(limit), 50); // hard safety cap
  const skip = (Number(page) - 1) * take;

  if (Number.isNaN(take) || Number.isNaN(skip) || take <= 0 || skip < 0) {
    return next(createHttpError(400, 'Invalid pagination parameters'));
  }

  try {
    const where: any = {};

    if (type) {
      where.type = type;
    }

    if (courseId && !Array.isArray(courseId)) {
      where.courseId = courseId;
    }

    const [testimonials, total] = await Promise.all([
      prisma.testimonial.findMany({
        where,
        take,
        skip,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          course: true,
        },
      }),
      prisma.testimonial.count({ where }),
    ]);

    return res.status(200).json({
      data: testimonials,
      meta: {
        total,
        page: Number(page),
        limit: take,
        totalPages: Math.ceil(total / take),
      },
    });
  } catch (error) {
    console.error(error);
    return next(createHttpError(500, 'Error while fetching testimonials'));
  }
};

export { getTestimonials };
