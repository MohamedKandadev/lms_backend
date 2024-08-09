import express from "express";
const analyticsRoutes = express.Router();

import { userAnalytics, courseAnalytics, orderAnalytics } from "../controllers/analytics.contoller";
import { authorizeRole, isAutheticated } from '../middleware/auth';

analyticsRoutes.get('/users', isAutheticated, authorizeRole('admin'), userAnalytics)
analyticsRoutes.get('/courses', isAutheticated, authorizeRole('admin'), courseAnalytics)
analyticsRoutes.get('/orders', isAutheticated, authorizeRole('admin'), orderAnalytics)


export default analyticsRoutes;