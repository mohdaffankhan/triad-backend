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

const detachToolFromCourse = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { courseId, toolId } = req.params;

  if (
    !courseId ||
    !toolId ||
    Array.isArray(courseId) ||
    Array.isArray(toolId)
  ) {
    return next(createHttpError(400, 'course id and tool id are required'));
  }

  try {
    const relation = await prisma.courseTool.findUnique({
      where: {
        courseId_toolId: {
          courseId,
          toolId,
        },
      },
    });

    if (!relation) {
      return next(createHttpError(404, 'Tool is not attached to this course'));
    }

    await prisma.courseTool.delete({
      where: {
        courseId_toolId: {
          courseId,
          toolId,
        },
      },
    });

    return res.status(200).json({
      message: 'Tool detached from course successfully',
    });
  } catch (error) {
    console.log(error);
    return next(createHttpError(500, 'Error while detaching tool from course'));
  }
};

const getToolsByCourseId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { courseId } = req.params;

  if (!courseId || Array.isArray(courseId)) {
    return next(createHttpError(400, 'Course id is required'));
  }

  try {
    const tools = await prisma.courseTool.findMany({
      where: { courseId },
      include: {
        tool: true,
      },
    });

    return res.status(200).json(tools);
  } catch (error) {
    console.log(error);
    return next(createHttpError(500, 'Error while fetching tools for course'));
  }
};

const getCoursesByToolId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { toolId } = req.params;

  if (!toolId || Array.isArray(toolId)) {
    return next(createHttpError(400, 'Tool id is required'));
  }

  try {
    const courses = await prisma.courseTool.findMany({
      where: { toolId },
      include: {
        course: true,
      },
    });

    return res.status(200).json(courses);
  } catch (error) {
    console.log(error);
    return next(createHttpError(500, 'Error while fetching courses for tool'));
  }
};

export {
  attachToolToCourse,
  detachToolFromCourse,
  getToolsByCourseId,
  getCoursesByToolId,
};
