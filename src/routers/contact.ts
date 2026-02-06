import express from 'express';
import { getContact } from '../controllers/contact.js';

const contactRouter = express.Router();

contactRouter.get('/', getContact);

export default contactRouter;
