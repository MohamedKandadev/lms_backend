import mongoose, { SortOrder } from "mongoose";
import { Response, Request, NextFunction } from "express";
import asyncHandler from 'express-async-handler';
import cloudinary from 'cloudinary';

import ErrorHandler from "../utils/errorHandler";
import Course, { courseDataModel } from "../models/course.model";
import { IQuestion, IAnswerQuestion } from "../interfaces/course.interface";
import sendMail from '../utils/sendMail';

// Create Course
export const createCourse = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const {course, content, options} = req.body;
  if(course.thumbnail !== ""){
    const myCloud = await cloudinary.v2.uploader.upload(course.thumbnail, {
      folder: "courses",
      width: 150
    });
    course.thumbnail = {
      publicId: myCloud.public_id,
      url: myCloud.secure_url
    }
  }
  const newCourse = new Course(course);
  const courseSave = await newCourse.save();
  const newCourseContent = content.map(async (item: any) => {
    if(item.videoThumb !== ""){
      const myCloud = await cloudinary.v2.uploader.upload(item.videoThumb, {
        folder: "courses",
        width: 150
      });
      item.videoThumb = {
        publicId: myCloud.public_id,
        url: myCloud.secure_url
      }
    }
    const newContent = new  courseDataModel({...item, course: courseSave._id})
    const contentSave = await newContent.save();
    const courseExiste = await Course.findById(courseSave._id);
    courseExiste?.courseData.push(contentSave._id)
    await courseExiste?.save();
  })
  // res.status(200).json(newCourseContent)
  res.status(200).json('Create course success');
})

export const createCourseData = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { courseId } = req.params;
  const data = req.body;
  const courseExiste = await Course.findById(courseId);
  if(!courseExiste){
    return next(new ErrorHandler('Invalid course Id', 400));
  }
  if(data.thumbnail){
    const myCloud = await cloudinary.v2.uploader.upload(data.thumbnail, {
      folder: "courses",
      width: 150
    });
    data.thumbnail = {
      publicId: myCloud.public_id,
      url: myCloud.secure_url
    }
  }
  data.course = courseId;
  const newCourseData = new courseDataModel(data);
  const courseDataSave = await newCourseData.save();
  courseExiste?.courseData.push(courseDataSave._id)
  await courseExiste?.save();
  res.status(200).json('Add course data successfully');
  // res.status(200).json({data, courseId});
}) 

// Edit Course 
export const editCourse = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const data = req.body;
  if(data.thumbnail){
    await cloudinary.v2.uploader.destroy(data.thumbnail.publicId)
    const myCloud = await cloudinary.v2.uploader.upload(data.thumbnail, {
      folder: "courses",
      width: 150
    });
    data.thumbnail = {
      publicId: myCloud.public_id,
      url: myCloud.secure_url
    }
  }
  Course.findByIdAndUpdate(req.params.courseId, { $set: data }, { new: true });
  res.status(200).json('Update course Success')
})

// Get single course
export const getSingleCourse = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const course = await Course.findById(req.params.courseId).populate({
    path: "courseData",
    select: '-videoUrl -suggestion -questions -links'
  }).populate({
    path: "reviews"
  })
  res.status(200).json({course})
})

interface PaginationQuery {
  limit?: number;
  page?: number;
  search?: string;
  sort?: any;
}

// Get single course
export const getAllCourses = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  let { page, search, sort } = req.query as PaginationQuery; 
  console.log(sort.toString())
  if(!page) page = 1;
  let courses: any;
  let numberCourses: number;
  if(search){
    if(sort === 'default'){
      courses = await Course.where({ name: { $regex: '.*' + search + '.*' }})
      .limit(8)
      .skip((page - 1) * 8)
      .select('-courserData.videoUrl -courserData.suggestion -courserData.questions -courserData.links')
    }
    courses = await Course.where({ name: { $regex: '.*' + search + '.*' }}).sort(sort.toString())
    .limit(8)
    .skip((page - 1) * 8)
    .select('-courserData.videoUrl -courserData.suggestion -courserData.questions -courserData.links')
    numberCourses = await Course.find({ name: { $regex: '.*' + search + '.*' }}).countDocuments();
  }else{
    if(sort === 'default'){
      courses = await Course.find()
      .limit(8)
      .skip((page - 1) * 8)
      .select('-courserData.videoUrl -courserData.suggestion -courserData.questions -courserData.links')
    }
    courses = await Course.find().sort(sort.toString())
    .limit(8)
    .skip((page - 1) * 8)
    .select('-courserData.videoUrl -courserData.suggestion -courserData.questions -courserData.links')
    numberCourses = await Course.find().countDocuments();
  }
  
  res.status(200).json({courses, numberCourses})
})

interface userRequest extends Request {
  user?: any
}
// Get Signle Course By Use
export const getCourseByUser = asyncHandler(async (req: userRequest, res: Response, next: NextFunction) => {
  const courseList = req.user?.courses;
  const {courseId} = req.params;
  const courseExiste = courseList.find((course: any) => course._id.toString() === courseId)
  if(!courseExiste){
    next(new ErrorHandler('You Cant Access this Course', 400))
  }
  const courseContent = await Course.findById(req.params.courseId).select('+courseData');
  res.status(200).json({courseContent})
})

// Get All Courses For Admin
export const getAllCoursesAdmin =  asyncHandler(async (req: userRequest, res: Response, next: NextFunction) =>{
  const Courses = await Course.find();
  res.status(200).json(Courses);
})

// Delete Course (====> Only For Admin)
export const deleteCourse =  asyncHandler(async (req: userRequest, res: Response, next: NextFunction) =>{
  // const { courseId } = req.params;
  // const courserData = await Course
  //   .findById(courseId).distinct('courseData');
    // .populate({ 
    //   path: 'courseData',
    //   populate: {
    //     path: 'questions',
    //   } 
    // })
    // const courseContent = await courseDataModel.find({_id: {$in: courserData}})
    // const courseContent = await courseDataModel.find({_id: '6571ad994aeb2baa4e4d4cda'})
  // res.json(courseContent) 
  // const datas = await courseDataModel.deleteMany({_id: {$in: courserData}});
  // .populate({ 
  //   path: 'courseData',
  //   populate: {
  //     path: 'questions',
  //   } 
  // })
  // .populate('courseData.questions'); 
  // if(!course) return next(new ErrorHandler('Course not found', 400))
  // await user.deleteOne({ userId })
  // res.status(200).json({message: 'User delete successfully'});
  // res.json(datas);
})