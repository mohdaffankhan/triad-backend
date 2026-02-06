import express from 'express';
import { createMentor, deleteMentor, getAllMentors } from '../controllers/mentor.js';
import { upload } from '../config/multer.js';

const mentorRouter = express.Router();

mentorRouter.route('/create').post(upload.single('image'), createMentor);
mentorRouter.route('/delete/:mentorId').delete(deleteMentor);
mentorRouter.route('/').get(getAllMentors);

export default mentorRouter