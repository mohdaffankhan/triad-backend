import type { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import prisma from '../lib/prisma.js';

const createTestimonial = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, role, image, quote, type, courseId } = req.body;

    if (!name || !quote) {
      return next(createHttpError(400, 'Name and quote are required'));
    }

    if (type === 'COURSE') {
      if (!courseId || Array.isArray(courseId)) {
        return next(
          createHttpError(400, 'course id is required for Course testimonial'),
        );
      }

      const courseExists = await prisma.course.findUnique({
        where: { id: courseId },
      });

      if (!courseExists) {
        return next(createHttpError(404, 'Course not found'));
      }
    }

    if (type === 'GENERAL' && courseId) {
      return next(
        createHttpError(
          400,
          'course id must not be provided for GENERAL testimonial',
        ),
      );
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        name,
        role: role || null,
        image: image || null,
        quote,
        type: type || 'GENERAL',
        courseId: type === 'COURSE' ? courseId : null,
      },
    });

    return res.status(201).json(testimonial);
  } catch (error) {
    console.log(error);
    return next(createHttpError(500, 'Error while creating testimonial'));
  }
};

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

const getAllTestimonials = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        course: true,
      },
    });

    return res.status(200).json({
      total: testimonials.length,
      data: testimonials,
    });
  } catch (error) {
    console.error(error);
    return next(createHttpError(500, 'Error while fetching all testimonials'));
  }
};

const getTestimonialsByCourseId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { courseId } = req.params;

  if (!courseId || Array.isArray(courseId)) {
    return next(createHttpError(400, 'Course id is required'));
  }

  try {
    const testimonials = await prisma.testimonial.findMany({
      where: {
        courseId,
        type: 'COURSE',
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.status(200).json(testimonials);
  } catch (error) {
    console.log(error);
    return next(
      createHttpError(500, 'Error while fetching course testimonials'),
    );
  }
};

const updateTestimonial = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;

  if (!id || Array.isArray(id)) {
    return next(createHttpError(400, 'Testimonial id is required'));
  }

  try {
    const testimonial = await prisma.testimonial.findUnique({
      where: { id },
    });

    if (!testimonial) {
      return next(createHttpError(404, 'Testimonial not found'));
    }

    const data: any = {};
    const body = req.body;

    if (body.name) data.name = body.name;
    if (body.role !== undefined) data.role = body.role || null;
    if (body.image !== undefined) data.image = body.image || null;
    if (body.quote) data.quote = body.quote;

    // Type change handling
    if (body.type) {
      if (body.type === 'COURSE') {
        if (!body.courseId) {
          return next(
            createHttpError(400, 'courseId required for COURSE testimonial'),
          );
        }

        const courseExists = await prisma.course.findUnique({
          where: { id: body.courseId },
        });

        if (!courseExists) {
          return next(createHttpError(404, 'Course not found'));
        }

        data.type = 'COURSE';
        data.courseId = body.courseId;
      }

      if (body.type === 'GENERAL') {
        data.type = 'GENERAL';
        data.courseId = null;
      }
    }

    const updated = await prisma.testimonial.update({
      where: { id },
      data,
    });

    return res.status(200).json(updated);
  } catch (error) {
    console.log(error);
    return next(createHttpError(500, 'Error while updating testimonial'));
  }
};

export {
  createTestimonial,
  getTestimonials,
  getAllTestimonials,
  getTestimonialsByCourseId,
  updateTestimonial
};
