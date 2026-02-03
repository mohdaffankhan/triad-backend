import express from 'express';
import { createWorkshop, getAllWorkshops, updateWorkshop } from '../controllers/workshop.js';
import { upload } from '../config/multer.js';

const workshopRouter = express.Router();

workshopRouter.get('/', getAllWorkshops);
workshopRouter.post('/', upload.single('coverImage'), createWorkshop);
workshopRouter.put('/:id', upload.single('coverImage'), updateWorkshop);

export default workshopRouter;
