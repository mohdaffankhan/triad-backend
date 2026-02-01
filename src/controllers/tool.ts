import type { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import prisma from '../lib/prisma.js';

const createTool = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, url } = req.body;

    if (!name || !description || !url) {
      return next(createHttpError(400, 'All fields are required'));
    }

    const tool = await prisma.tool.create({
      data: {
        name,
        description,
        url,
      },
    });

    return res.status(201).json(tool);
  } catch (error) {
    console.log(error);
    return next(createHttpError(500, 'Error while creating tool'));
  }
};

const getAllTools = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tools = await prisma.tool.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.status(200).json(tools);
  } catch (error) {
    console.log(error);
    return next(createHttpError(500, 'Error while fetching tools'));
  }
};

const updateTool = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  if (!id || Array.isArray(id)) {
    return next(createHttpError(400, 'Tool id is required'));
  }

  try {
    const tool = await prisma.tool.findUnique({
      where: { id },
    });

    if (!tool) {
      return next(createHttpError(404, 'Tool not found'));
    }

    const data: any = {};
    const body = req.body || {};

    if (body.name) data.name = body.name;
    if (body.description) data.description = body.description;
    if (body.url) data.url = body.url;

    const updatedTool = await prisma.tool.update({
      where: { id },
      data,
    });

    return res.status(200).json(updatedTool);
  } catch (error) {
    console.log(error);
    return next(createHttpError(500, 'Error while updating tool'));
  }
};

export { createTool, getAllTools, updateTool };
