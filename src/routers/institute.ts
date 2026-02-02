import express from 'express';
import { createInstitution, deleteInstitution, getAllInstitutions, updateInstitution } from '../controllers/institute.js';
import { upload } from '../config/multer.js';

const instituteRouter = express.Router();

instituteRouter.get("/", getAllInstitutions);
instituteRouter.post("/", upload.single("logo"), createInstitution);
instituteRouter.put("/:id", upload.single("logo"), updateInstitution);
instituteRouter.delete("/:id", deleteInstitution);

export default instituteRouter;
