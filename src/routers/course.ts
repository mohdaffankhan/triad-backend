import express from 'express';
import { createCourse, getCourseById } from '../controllers/courses.js';
import { upload } from '../config/multer.js';

const courseRouter = express.Router();

courseRouter.route("/create").post(upload.single('coverImage'), createCourse);
courseRouter.route("/:courseId").get(getCourseById);

export default courseRouter