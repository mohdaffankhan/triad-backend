import express from 'express';
import cors from 'cors';

const app = express();
app.use(
  cors({
    origin: 'http://localhost:3001',
    credentials: true,
  }),
);
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Triad' });
});

// mentor router
import mentorRouter from './routers/mentor.js';
app.use('/api/v1/mentors', mentorRouter);

//course router
import courseRouter from './routers/course.js';
app.use('/api/v1/courses', courseRouter);

//course-mentor router
import courseMentorRouter from './routers/course-mentor.js';
app.use('/api/v1/course-mentor', courseMentorRouter);

// tool router
import toolRouter from './routers/tool.js';
app.use('/api/v1/tools', toolRouter);

// workshop router
import workshopRouter from './routers/workshop.js';
app.use('/api/v1/workshops', workshopRouter);

// institute router
import instituteRouter from './routers/institute.js';
app.use('/api/v1/institutes', instituteRouter);

// privacy policy router
import privacyPolicyRouter from './routers/privacyPolicy.js';
app.use('/api/v1/privacy-policy', privacyPolicyRouter);

// terms of service router
import termsOfServiceRouter from './routers/termsOfService.js';
app.use('/api/v1/terms-of-service', termsOfServiceRouter);

// career router
import careerRouter from './routers/career.js';
app.use('/api/v1/careers', careerRouter);


// todo review
// contact details router
import contactDetailsRouter from './routers/todo/contactDetails.js';
app.use('/api/v1/contact-details', contactDetailsRouter);

// social link router
import socialLinkRouter from './routers/todo/socialLink.js';
app.use('/api/v1/social-link', socialLinkRouter);

// metrics router
import metricsRouter from './routers/todo/metrics.js';
app.use('/api/v1/metrics', metricsRouter);

// testimonials router
import testimonialsRouter from './routers/todo/testimonials.js';
app.use('/api/v1/testimonials', testimonialsRouter);

export default app;
