import express from "express";
const courseRoutes = express.Router();

import { 
  createCourse, 
  getSingleCourse, 
  getAllCourses, 
  getCourseByUser, 
  editCourse,
  createCourseData,
  getAllCoursesAdmin,
  deleteCourse
} from "../controllers/course.controller";
import { authorizeRole, isAutheticated } from '../middleware/auth';

courseRoutes.route('/')
  .post(isAutheticated, authorizeRole('admin'), createCourse)
  .get(getAllCourses)
courseRoutes.route('/:courseId')
  .put(isAutheticated, authorizeRole('admin'), editCourse)
  .get(getSingleCourse)
  .delete(isAutheticated, authorizeRole('admin'), deleteCourse)
courseRoutes.route('/course-content/:courseId')
  .get(isAutheticated, getCourseByUser) // Get content by user
  .put(isAutheticated, authorizeRole('admin'), createCourseData) // Create course data by course

// Get all courses with content for admin user
courseRoutes.get('/all-courses',isAutheticated, authorizeRole('admin'), getAllCoursesAdmin) 

export default courseRoutes;