import express from 'express';
import { createInstitution } from '../controllers/institute.js';
import { upload } from '../config/multer.js';

const instituteRouter = express.Router();

instituteRouter.post("/", upload.single("logo"), createInstitution);


export default instituteRouter;
