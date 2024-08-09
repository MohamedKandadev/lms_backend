import mongoose, { Schema, Model } from "mongoose";

import { ICourseData, ICourse, ILink } from "../interfaces/course.interface";

const linkSchema = new Schema<ILink>({
  title: String,
  url: String,
})

const courseDataSchema = new Schema<ICourseData>({
  title: String,
  description: String,
  videoUrl: String,
  videoThumb: {
    publicId:{
      type: String,
    },
    url:{
      type: String,
    },
  },
  links: [linkSchema],
  suggestion: String,
  questions: [{type: mongoose.Types.ObjectId, ref: 'Question'}],
  course: {type: mongoose.Types.ObjectId, ref: 'Course'}
}, {timestamps: true})

const courseSchema = new Schema<ICourse>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  estimatedPrice: {
    type: Number,
  },
  thumbnail: {
    publicId:{
      type: String,
    },
    url:{
      type: String,
    },
  },
  tags: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    required: true,
  },
  demoUrl: {
    type: String,
    required: true,
  },
  benefits: [{title: String}],
  prerequisites: [{title: String}],
  courseData: [{type: mongoose.Types.ObjectId, ref: 'CourseData'}],
  reviews: [{type: mongoose.Types.ObjectId, ref: 'Review'}],

  ratings: {
    type: Number,
    default: 0
  },
  purchased: {
    type: Number,
    default: 0
  },
}, {timestamps: true})


// courseSchema.pre<ICourse>("deleteMany",async function(next) {
//   console.log(this)
//   next();
// })

// courseDataSchema.pre<ICourse>("deleteMany",async function(next) {
//   console.log(this)
//   next();
// })


const courseModel: Model<ICourse> = mongoose.model('Course', courseSchema);
export const courseDataModel: Model<ICourseData> = mongoose.model('CourseData', courseDataSchema);
export default courseModel;