import express from 'express';
import {
  createTestimonial,
  getTestimonials
} from '../controllers/testimonial.js';

const testimonialRouter = express.Router();

testimonialRouter.post('/', createTestimonial);

//  GET /testimonials?type=&courseId=&limit=&page=
testimonialRouter.get('/', getTestimonials);

export default testimonialRouter;
