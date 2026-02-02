import express from 'express';
import { getPrivacyPolicy, upsertPrivacyPolicy } from '../controllers/privacyPolicy.js';

const privacyPolicyRouter = express.Router();

privacyPolicyRouter.route('/').get(getPrivacyPolicy);
privacyPolicyRouter.route('/').put(upsertPrivacyPolicy);

export default privacyPolicyRouter