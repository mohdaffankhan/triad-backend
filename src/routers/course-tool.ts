import express from 'express';
import { attachToolToCourse } from '../controllers/course-tool.js';

const courseToolRouter = express.Router();

courseToolRouter.post('/', attachToolToCourse);

export default courseToolRouter;
