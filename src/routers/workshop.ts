import express from 'express';
import { createWorkshop, getAllWorkshops } from '../controllers/workshop.js';
import { upload } from '../config/multer.js';

const workshopRouter = express.Router();

workshopRouter.get('/', getAllWorkshops);
workshopRouter.post('/', upload.single('coverImage'), createWorkshop);

export default workshopRouter;
