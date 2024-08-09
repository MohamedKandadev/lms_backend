import express from 'express';
export const app = express();
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import {ErrorMiddleware} from './middleware/error';
import UserRoutes from './routes/user.route';
import courseRoutes from './routes/course.route';
import questionRoutes from './routes/question.route';
import reviewRoutes from './routes/review.route';
import orderRoutes from './routes/order.route';
import notificationRoutes from './routes/notification.route';
import analyticsRoutes from './routes/analytics.route';

dotenv.config();  

// Body Parser
app.use(express.json());

// Cookier Parser
app.use(cookieParser());

// Cors 
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH'],
  credentials: true
}))

// Routes
app.use('/api/users', UserRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/analytics', analyticsRoutes);

// Error Middleware
app.use(ErrorMiddleware);

var publicDir = require('path').join(__dirname,'./public'); 
app.use(express.static('./public'));