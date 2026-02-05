import express from 'express';
import {
  getTestimonials
} from '../controllers/testimonial.js';

const testimonialRouter = express.Router();

testimonialRouter.get('/', getTestimonials);

export default testimonialRouter;
