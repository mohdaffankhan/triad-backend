import express from 'express';
import { attachToolToCourse, detachToolFromCourse, getToolsByCourseId } from '../controllers/course-tool.js';

const courseToolRouter = express.Router();

courseToolRouter.post('/', attachToolToCourse);
courseToolRouter.delete('/:courseId/:toolId', detachToolFromCourse);
courseToolRouter.get('/courses/:courseId/tools', getToolsByCourseId);

export default courseToolRouter;
