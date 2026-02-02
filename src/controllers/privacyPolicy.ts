import type { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import prisma from '../lib/prisma.js';

const getPrivacyPolicy = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const policy = await prisma.privacyPolicy.findFirst();

    if (!policy) {
      return next(createHttpError(404, 'Privacy Policy not set yet'));
    }

    return res.status(200).json(policy);
  } catch (error) {
    console.log(error);
    return next(createHttpError(500, 'Failed to fetch privacy policy'));
  }
};

export { getPrivacyPolicy };
