import type { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import prisma from '../../lib/prisma.js';

const getSocialLinks = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const socialLinks = await prisma.social_link.findMany();

    return res.status(200).json(socialLinks);
  } catch (error) {
    console.log(error);
    return next(createHttpError(500, 'Error while fetching social links'));
  }
};

export { getSocialLinks };
