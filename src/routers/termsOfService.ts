import express from 'express';
import { getTermsOfService } from '../controllers/termsOfService.js';

const termsOfServiceRouter = express.Router();

termsOfServiceRouter.route('/').get(getTermsOfService);

export default termsOfServiceRouter