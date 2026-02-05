import express from 'express';
import { createCareer } from '../controllers/career.js';

const careerRouter = express.Router();

careerRouter.route('/').post(createCareer);

export default careerRouter;
