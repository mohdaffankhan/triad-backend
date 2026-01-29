import express from 'express'
import { assignMentorsToCourse, getMentorsForCourse } from '../controllers/course-mentor.js'

const courseMentorRouter = express.Router()

courseMentorRouter.route('/:courseId/').post(assignMentorsToCourse)
courseMentorRouter.route('/:courseId/').get(getMentorsForCourse)

export default courseMentorRouter
