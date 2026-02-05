import express from 'express';
import { getContactDetails } from '../controllers/contact.js';

const socialLinkRouter = express.Router();

socialLinkRouter.get('/', getContactDetails);

export default socialLinkRouter;