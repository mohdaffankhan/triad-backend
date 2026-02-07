import express from 'express';
import {
  createTestimonial,
  getTestimonials,
  getAllTestimonials,
  getTestimonialsByCourseId
} from '../controllers/testimonial.js';

const testimonialRouter = express.Router();

testimonialRouter.post('/', createTestimonial);

//  GET /testimonials?type=&courseId=&limit=&page=
testimonialRouter.get('/', getTestimonials);

testimonialRouter.get('/all', getAllTestimonials);
testimonialRouter.get('/course/:courseId', getTestimonialsByCourseId);

export default testimonialRouter;
