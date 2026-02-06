import type { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import prisma from '../lib/prisma.js';

const getContact = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const contact = await prisma.contact.findFirst();

    if (!contact) {
      return next(createHttpError(404, 'Contact information not set yet'));
    }

    return res.status(200).json(contact);
  } catch (error) {
    console.log(error);
    return next(
      createHttpError(500, 'Error while fetching contact information'),
    );
  }
};

export { getContact };
