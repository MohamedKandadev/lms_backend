import mongoose, { Document, Schema, Model } from "mongoose";

import { IReview } from "../interfaces/course.interface"; 

const reviewSchema = new Schema<IReview>({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User"
  },
  rating: {
    type: Number,
    default: 0,
  },
  review: {
    type: String,
    required: true
  },
  course: {
    type: mongoose.Types.ObjectId,
    ref: "Course"
  },
}, {timestamps: true})

const reviewModel: Model<IReview> = mongoose.model('Review', reviewSchema);
export default reviewModel;
export { reviewSchema }