import express from 'express';
import {
  attachToolToCourse,
  detachToolFromCourse,
} from '../controllers/course-tool.js';

const courseToolRouter = express.Router();

courseToolRouter.post('/', attachToolToCourse);
courseToolRouter.delete('/:courseId/:toolId', detachToolFromCourse);

export default courseToolRouter;
