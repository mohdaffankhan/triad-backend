import express from 'express';
import { createMentor } from '../controllers/mentor.js';
import { upload } from '../config/multer.js';

const mentorRouter = express.Router();

mentorRouter.route('/create').post(upload.single('image'), createMentor);

export default mentorRouter