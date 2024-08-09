import mongoose from "mongoose";
import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';

import ErrorHandler from "../utils/errorHandler";
import Order from "../models/order.model";
import Notification from "../models/notification.model";
import Course from '../models/course.model';
import User from '../models/user.model';
import sendMail from '../utils/sendMail';

interface userRequest extends Request {
  user?: any
}

// Add Question
export const createOrder = asyncHandler(async (req: userRequest, res: Response, next: NextFunction) =>{
  const { courseId } = req.params;
  const { payament_info } = req.body;
  const user = await User.findById(req.user?._id).populate('courses')
  const courseExists = user?.courses.find(c => c._id.toString() === courseId.toString() );
  if(courseExists){
    return next(new ErrorHandler('You already have this course', 400));
  }
  const course = await Course.findById(courseId);
  if(courseExists){
    return next(new ErrorHandler('Course not found', 400));
  }
  const orderData: any = {
    user: req.user?._id,
    course: courseId,
    payament_info
  }
  const notificationData:any = {
    title: 'New order',
    message: `You have a new order from ${course?.name}`
  }
  const newNotification = new Notification(notificationData)
  const newOrder = new Order(orderData);
  const orderSave = await newOrder.save();
  await newNotification.save();
  user?.courses.push(courseId)
  await user?.save();
  const mailData = {
    order:{
      _id: courseId.slice(0, 6),
      name: course?.name,
      price: course?.price,
      date: new Date().toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'}),
      userName: req.user?.name
    }
  }
  // Send  email order confirmation to user 
  await sendMail({
    email: user?.email || '',
    subject: 'Order Confirmation',
    template: 'orderConfirmation.ejs',
    data: mailData
  });
  res.status(200).json('Create order successful');
})

// Get All Orders For Admin
export const getAllOrders =  asyncHandler(async (req: userRequest, res: Response, next: NextFunction) =>{
  const orders = await Order.find();
  res.status(200).json(orders);
})