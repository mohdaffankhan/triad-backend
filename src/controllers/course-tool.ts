import type { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import prisma from '../lib/prisma.js';

const attachToolToCourse = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { courseId, toolId } = req.body;

  if (!courseId || !toolId) {
    return next(createHttpError(400, 'course id and tool id are required'));
  }

  try {
    // Ensure both exist
    const [course, tool] = await Promise.all([
      prisma.course.findUnique({ where: { id: courseId } }),
      prisma.tool.findUnique({ where: { id: toolId } }),
    ]);

    if (!course) {
      return next(createHttpError(404, 'Course not found'));
    }

    if (!tool) {
      return next(createHttpError(404, 'Tool not found'));
    }

    const courseTool = await prisma.courseTool.create({
      data: {
        courseId,
        toolId,
      },
    });

    return res.status(201).json(courseTool);
  } catch (error: any) {
    // Unique constraint violation (already attached)
    if (error.code === 'P2002') {
      return next(createHttpError(409, 'Tool already attached to this course'));
    }

    console.log(error);
    return next(createHttpError(500, 'Error while attaching tool to course'));
  }
};

export { attachToolToCourse };
