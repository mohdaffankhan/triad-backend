import type { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import prisma from '../lib/prisma.js';

const getMetrics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const metrics = await prisma.metrics.findFirst();

    if (!metrics) {
      return next(createHttpError(404, 'Metrics not found'));
    }

    return res.status(200).json(metrics);
  } catch (error) {
    console.log(error);
    return next(createHttpError(500, 'Error while fetching metrics'));
  }
};

export { getMetrics };