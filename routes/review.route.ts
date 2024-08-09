import express from "express";
const reviewRoutes = express.Router();

import { addReview } from "../controllers/review.controller";
import { authorizeRole, isAutheticated } from '../middleware/auth';

reviewRoutes.route('/:courseId')
  .post(isAutheticated, addReview)


export default reviewRoutes;