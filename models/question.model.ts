import mongoose, { Document, Schema, Model } from "mongoose";

import { IQuestionModel } from "../interfaces/course.interface"; 

const quesionSchema = new Schema<IQuestionModel>({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User"
  },
  question: {
    type: String,
    required: true
  },
  questionReplies: [{user: {type: mongoose.Types.ObjectId, ref: 'User'}, answer: String}],
  courseContent: {type: mongoose.Types.ObjectId, ref: 'CourseData'}
}, {timestamps: true})

const questioModel = mongoose.model('Question', quesionSchema);
export default questioModel;