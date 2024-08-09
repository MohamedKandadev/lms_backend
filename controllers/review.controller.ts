import mongoose from "mongoose";
import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';

import ErrorHandler from "../utils/errorHandler";
import Course from "../models/course.model";
import User from "../models/user.model";
import Review from "../models/review.model";
import { IReviewC } from "../interfaces/course.interface";

interface userRequest extends Request {
  user?: any
}

// Add Review
export const addReview = asyncHandler(async (req: userRequest, res: Response, next: NextFunction) =>{
  const { review } = req.body;
  const { courseId } = req.params;
  const coursesList = req.user?.courses;
  // Check if course id exists on course user list
  const courseExiste = coursesList.find(c => c.courseId === courseId)
  if(!courseExiste){
    return next(new ErrorHandler('You dont have access to this course', 400))
  }
  const course = await Course.findById(courseId);
  const newReview: IReviewC = {
    user: req.user?._id,
    review,
    course: courseId,
    rating: 10
  }
  let reviewSave = new Review(newReview)
  reviewSave = await reviewSave.save();
  course?.reviews.push(reviewSave?._id);
  course?.save();
  res.status(200).json('success')
})