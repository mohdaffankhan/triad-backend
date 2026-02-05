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

const upsertPrivacyPolicy = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { content, effectiveDate } = req.body || {};

    if (!content || !effectiveDate) {
      return next(
        createHttpError(400, 'Content and effectiveDate are required'),
      );
    }

    const existing = await prisma.privacyPolicy.findFirst();

    const policy = existing
      ? await prisma.privacyPolicy.update({
          where: { id: existing.id },
          data: {
            content,
            effectiveDate: new Date(effectiveDate).toISOString(),
          },
        })
      : await prisma.privacyPolicy.create({
          data: {
            content,
            effectiveDate,
          },
        });

    return res.status(200).json(policy);
  } catch (error) {
    console.log(error);
    return next(createHttpError(500, 'Failed to save privacy policy'));
  }
};

export { getPrivacyPolicy, upsertPrivacyPolicy };
