import express from 'express';
import { attachToolToCourse, detachToolFromCourse, getCoursesByToolId, getToolsByCourseId } from '../controllers/course-tool.js';

const courseToolRouter = express.Router();

courseToolRouter.post('/', attachToolToCourse);
courseToolRouter.delete('/:courseId/:toolId', detachToolFromCourse);
courseToolRouter.get('/courses/:courseId/tools', getToolsByCourseId);
courseToolRouter.get('/tools/:toolId/courses', getCoursesByToolId);

export default courseToolRouter;
