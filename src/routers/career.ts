import express from 'express';
import {
  createCareer,
  getAllCareers,
  getCareerById,
  getFeaturedCareers,
} from '../controllers/career.js';

const careerRouter = express.Router();

careerRouter.route('/').post(createCareer);
careerRouter.route('/').get(getAllCareers);
careerRouter.route('/featured').get(getFeaturedCareers);
careerRouter.route('/:id').get(getCareerById);

export default careerRouter;
