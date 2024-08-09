import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import cron from 'node-cron';

import ErrorHandler from "../utils/errorHandler";
import Notification from "../models/notification.model";

// Get all Notification for amdin
export const getAllNotifications = asyncHandler(async (req: Request, res: Response, next: NextFunction) =>{
  const notifications = await Notification.find().sort({createdAt: -1});
  res.status(200).json({notifications})
})

// Update notifications
export const updateNotification = asyncHandler(async (req: Request, res: Response, next: NextFunction) =>{
  const { notificationId } = req.params; 
  const notification = await Notification.findById(notificationId);
  if(!notification) return next(new ErrorHandler('Notification not found!', 400))
  notification.status = 'read';
  await notification.save();
  const notifications = await Notification.find().sort({createdAt: -1});
  res.status(200).json({notifications})
})

// Delete notitification already Read by Admin After some time with (CRON)
cron.schedule("0 0 0 * * *", async()=>{
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  await Notification.deleteMany({status: 'read', createAt: {$lt: thirtyDaysAgo}})
})