import express from 'express';
import { getContactDetails } from '../controllers/contact.js';

const contactDetailsRouter = express.Router();

contactDetailsRouter.get('/:id', getContactDetails);

export default contactDetailsRouter;