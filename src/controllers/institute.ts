import type { NextFunction, Request, Response } from 'express';
import prisma from '../lib/prisma.js';
import createHttpError from 'http-errors';
import { getPublicId } from '../lib/cloudinary.js';
import {
  deleteOnCloudinary,
  uploadonCloudinary,
} from '../config/cloudinary.js';
import { recomputeMetrics } from '../services/metric.js';

const createInstitution = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, city, state } = req.body;
    const logoFile = req.file;

    if (!name || !city || !state) {
      return next(createHttpError(400, 'Name, city, and state are required'));
    }

    if (!logoFile) {
      return next(createHttpError(400, 'Institution logo is required'));
    }

    const logo = await uploadonCloudinary(logoFile.path, {
      folder: 'institutions',
    });

    if (!logo) {
      return next(createHttpError(500, 'Logo upload failed'));
    }

    const institution = await prisma.institution.create({
      data: {
        name,
        city,
        state,
        logo: logo.secure_url,
      },
    });

    await recomputeMetrics();

    return res.status(201).json(institution);
  } catch (error) {
    console.error(error);
    return next(createHttpError(500, 'Error while creating institution'));
  }
};

const getAllInstitutions = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const institutions = await prisma.institution.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json(institutions);
  } catch (error) {
    console.error(error);
    return next(createHttpError(500, 'Error while fetching institutions'));
  }
};

const updateInstitution = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;

  if (!id || Array.isArray(id)) {
    return next(createHttpError(400, 'Institution id is required'));
  }

  try {
    const institution = await prisma.institution.findUnique({
      where: { id },
    });

    if (!institution) {
      return next(createHttpError(404, 'Institution not found'));
    }

    const data: Record<string, any> = {};
    const { name, city, state } = req.body || {};

    if (name) data.name = name;
    if (city) data.city = city;
    if (state) data.state = state;

    // SAFE logo replacement
    if (req.file) {
      const newLogo = await uploadonCloudinary(req.file.path, {
        folder: 'institutions',
      });

      if (!newLogo) {
        return next(createHttpError(500, 'Logo upload failed'));
      }

      data.logo = newLogo.secure_url;
    }

    // Update DB first
    const updatedInstitution = await prisma.institution.update({
      where: { id },
      data,
    });

    // Delete old logo AFTER DB update
    if (req.file && institution.logo) {
      const oldPublicId = getPublicId(institution.logo);
      if (oldPublicId) {
        await deleteOnCloudinary(oldPublicId);
      }
    }

    await recomputeMetrics();

    return res.status(200).json(updatedInstitution);
  } catch (error) {
    console.error(error);
    return next(createHttpError(500, 'Error while updating institution'));
  }
};

const deleteInstitution = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;

  if (!id || Array.isArray(id)) {
    return next(createHttpError(400, 'Institution id is required'));
  }

  try {
    const institution = await prisma.institution.findUnique({
      where: { id },
    });

    if (!institution) {
      return next(createHttpError(404, 'Institution not found'));
    }

    // Delete logo from Cloudinary
    if (institution.logo) {
      const publicId = getPublicId(institution.logo);
      if (publicId) {
        await deleteOnCloudinary(publicId);
      }
    }

    // Delete DB record
    await prisma.institution.delete({
      where: { id },
    });

    await recomputeMetrics();

    return res.status(200).json({
      message: 'Institution deleted successfully',
    });
  } catch (error) {
    console.error(error);
    return next(createHttpError(500, 'Error while deleting institution'));
  }
};

export {
  createInstitution,
  getAllInstitutions,
  updateInstitution,
  deleteInstitution,
};
