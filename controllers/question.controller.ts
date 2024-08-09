import mongoose from "mongoose";
import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';

import ErrorHandler from "../utils/errorHandler";
import Question from "../models/question.model";
import { courseDataModel } from "../models/course.model";
import { IQuestion, IAnswerQuestion } from "../interfaces/course.interface";
import sendMail from '../utils/sendMail';

interface userRequest extends Request {
  user?: any
}

// Add Question
export const addQuestion = asyncHandler(async (req: userRequest, res: Response, next: NextFunction) =>{
  const { question }: IQuestion = req.body;
  const { contentId } = req.params;
  if( !mongoose.Types.ObjectId.isValid(contentId)){
    return next(new ErrorHandler('Invalid Content ID', 400));
  }
  const courseContent = await courseDataModel.findById(contentId);
  if(!courseContent){
    return next(new ErrorHandler('Invalid Content ID', 400));
  }
  const courseId = courseContent?.course;
  const isUserHasCourse= req.user.courses.find(c => c.toString() === courseId?.toString())
  if(!isUserHasCourse){
    return next(new ErrorHandler('You dont have access this course', 400));
  }

  // Create a new question object
  const newQuestion: any = {
    user: req.user?._id,
    question: question,
    questionReplies: [],
    courseContent: contentId
  }
  const questionClass = new Question(newQuestion);
  const questionSave = await questionClass.save();
  courseContent?.questions.push(questionSave?._id)
  await courseContent?.save();
  res.status(200).json({message: "Question successfully added"})
})

// Add answer to question
export const addAnswerQuestion = asyncHandler(async (req: userRequest, res: Response, next: NextFunction) =>{
  const { answer }: IAnswerQuestion = req.body;
  const { questionId } = req.params;
  if(!mongoose.Types.ObjectId.isValid(questionId)){
    return next(new ErrorHandler('Invalid question ID', 400));
  }
  let question = await Question.findById(questionId).populate('courseContent').populate('user');
  if(!question){
    return next(new ErrorHandler('Invalid question ID', 400));
  }
  // Create a new question object
  const newAnswer: any = {
    user: req.user?._id,
    answer
  }
  question?.questionReplies.push(newAnswer)
  if(req.user?._id === question?.user?._id){
    // Create notification to admin
  }else{
    // Send email to user (Admin answer to question)
    const data:any = {
      name: question?.user?.name,
      title: question?.courseContent?.title,
      answer
    }
    await sendMail({
      email: question?.user?.email,
      subject: 'New reply.',
      template: 'question-reply.ejs',
      data
    });
  }
  question = await question.save();
  res.status(200).json({message: "Success", question})
})