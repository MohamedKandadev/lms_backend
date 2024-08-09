import mongoose from "mongoose";
import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';

import { generatorLast12MonthsData } from "../utils/analytics.generator";
import User from "../models/user.model";
import Course from "../models/course.model";
import Order from "../models/order.model";

export const userAnalytics = asyncHandler(async (req: Request, res: Response, next: NextFunction) =>{
  const usersAnaly = await generatorLast12MonthsData(User);
  res.json(usersAnaly);
})
export const courseAnalytics = asyncHandler(async (req: Request, res: Response, next: NextFunction) =>{
  const coursesAnaly = await generatorLast12MonthsData(Course);
  res.json(coursesAnaly);
})
export const orderAnalytics = asyncHandler(async (req: Request, res: Response, next: NextFunction) =>{
  const ordersAnaly = await generatorLast12MonthsData(Order);
  res.json(ordersAnaly);
})