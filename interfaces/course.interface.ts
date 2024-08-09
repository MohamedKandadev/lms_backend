import  { Document } from "mongoose"

/*=============================
  Interfaces For Model Schema
===============================*/
interface ILink extends Document {
  title: string;
  url: string;
}

interface ICourseData extends Document {
  title: string;
  description: string;
  videoUrl: string;
  videoThumb: string;
  links: ILink[];
  suggestion: string;
  questions: Array<object>;
  course: object;
}

interface ICourse extends Course, Document {
}

interface IQuestionModel {
  user: object;
  question: string;
  questionReplies: {user: object, answer: string}[];
  courseContent: object;
}

interface IReview {
  user: object;
  rating: number;
  review: string;
  course: object
}
/*=============================
  Interfaces For Controller
===============================*/

interface Course {
  name: string;
  description: string;
  price: number;
  estimatedPrice?: number;
  thumbnail?: object;
  tags: string;
  level: string;
  demoUrl: string;
  benefits: {title: string}[];
  prerequisites: {title: string}[];
  reviews: Array<object>;
  courseData: Array<object>;
  ratings?: number;
  purchased?: number;
}

interface IQuestion {
  question: string,
  courseId: string,
  contentId: string,
}

interface IAnswerQuestion {
  answer: string,
  courseId: string,
  contentId: string,
  questionId: string,
}

interface IReviewC {
  user: string;
  rating: number;
  review: string;
  course: string
}

export { 
  ILink,
  ICourseData,
  ICourse,
  IQuestion,
  IReview,
  IQuestionModel,
  IAnswerQuestion,
  Course,
  IReviewC
}