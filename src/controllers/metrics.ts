import type { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import prisma from '../lib/prisma.js';

const getMetrics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const metrics = await prisma.metrics.findUnique({
      where: { id: 'singleton' },
    });

    if (!metrics) {
      return next(createHttpError(404, 'Metrics not initialized'));
    }

    return res.status(200).json(metrics);
  } catch (error) {
    return next(createHttpError(500, 'Error fetching metrics'));
  }
};

export { getMetrics };
