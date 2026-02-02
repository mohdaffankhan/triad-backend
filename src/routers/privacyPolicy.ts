import express from 'express';
import { getPrivacyPolicy } from '../controllers/privacyPolicy.js';

const privacyPolicyRouter = express.Router();

privacyPolicyRouter.route('/').get(getPrivacyPolicy);

export default privacyPolicyRouter