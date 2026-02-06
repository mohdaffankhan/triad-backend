import express from 'express';
import { getSocialLinks } from '../controllers/social.js';

const socialLinkRouter = express.Router();

socialLinkRouter.get('/', getSocialLinks);

export default socialLinkRouter;