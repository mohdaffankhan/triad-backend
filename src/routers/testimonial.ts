import express from 'express';
import { getTestimonials } from '../controllers/testimonial.js';

const testimonialRouter = express.Router();

//  GET /testimonials?type=&courseId=&limit=&page=
testimonialRouter.get('/', getTestimonials);

export default testimonialRouter;
