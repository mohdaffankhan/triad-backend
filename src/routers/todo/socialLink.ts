import express from 'express';
import { getContactDetails } from '../../controllers/todo/contactDetails.js';

const socialLinkRouter = express.Router();

socialLinkRouter.get('/', getContactDetails);

export default socialLinkRouter;
