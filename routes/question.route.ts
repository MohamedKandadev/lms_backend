import express from "express";
const questionRoutes = express.Router();

import { addQuestion, addAnswerQuestion } from "../controllers/question.controller";
import { authorizeRole, isAutheticated } from '../middleware/auth';

questionRoutes.route('/:contentId')
  .post(isAutheticated, addQuestion)
questionRoutes.put('/answer/:questionId', isAutheticated, authorizeRole('admin'), addAnswerQuestion);


export default questionRoutes;