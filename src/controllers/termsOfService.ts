import type { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import prisma from "../lib/prisma.js";

const getTermsOfService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const terms = await prisma.termsOfService.findFirst();

    if (!terms) {
      return next(
        createHttpError(404, "Terms of Service not set yet")
      );
    }

    return res.status(200).json(terms);
  } catch (error) {
    console.log(error);
    return next(
      createHttpError(500, "Failed to fetch Terms of Service")
    );
  }
};

export { getTermsOfService };
