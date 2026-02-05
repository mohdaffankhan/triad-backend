import express from 'express';
import { getTestimonials } from '../../controllers/todo/testimonials.js';

const testimonialsRouter = express.Router();

testimonialsRouter.get('/', getTestimonials);

export default testimonialsRouter;
