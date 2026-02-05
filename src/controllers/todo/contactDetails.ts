import type { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import prisma from '../../lib/prisma.js';

const getContactDetails = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const targetId = id || 'general';

    const details = await prisma.contact_details.findUnique({
      where: { id: targetId },
    });

    return res.status(200).json(details);
  } catch (error) {
    console.log(error);
    return next(createHttpError(500, 'Error while fetching contact details'));
  }
};

export { getContactDetails };
