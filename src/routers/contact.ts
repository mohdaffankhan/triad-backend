import express from 'express';
import { getContact, upsertContact } from '../controllers/contact.js';

const contactRouter = express.Router();

contactRouter.get('/', getContact);
contactRouter.put('/', upsertContact);

export default contactRouter;
