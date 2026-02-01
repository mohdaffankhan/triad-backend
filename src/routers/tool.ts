import express from 'express'
import { createTool, getAllTools, updateTool } from '../controllers/tool.js'

const toolRouter = express.Router()

toolRouter.route('/').post(createTool)
toolRouter.route('/').get(getAllTools)
toolRouter.route('/:id').put(updateTool)

export default toolRouter