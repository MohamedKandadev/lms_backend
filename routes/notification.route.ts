import express from "express";
const notificationRoutes = express.Router();

import { updateNotification, getAllNotifications } from "../controllers/notification.controller";
import { authorizeRole, isAutheticated } from '../middleware/auth';

notificationRoutes.route('/')
  .get(isAutheticated, authorizeRole('admin'), getAllNotifications)
notificationRoutes.route('/:notificationId')
  .put(isAutheticated, authorizeRole('admin'), updateNotification)




export default notificationRoutes;