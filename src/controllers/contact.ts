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

const upsertContact = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, phone, country_code } = req.body || {};

    if (!email || !phone || !country_code) {
      return next(
        createHttpError(400, 'Email, phone, and country code are required'),
      );
    }

    const existing = await prisma.contact.findFirst();

    const contact = existing
      ? await prisma.contact.update({
          where: { id: existing.id },
          data: {
            email,
            phone,
            country_code,
          },
        })
      : await prisma.contact.create({
          data: {
            email,
            phone,
            country_code,
          },
        });

    return res.status(200).json(contact);
  } catch (error) {
    console.log(error);
    return next(createHttpError(500, 'Error while saving contact information'));
  }
};

export { getContact, upsertContact };
