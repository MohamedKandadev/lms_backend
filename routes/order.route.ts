import express from "express";
const orderRoutes = express.Router();

import { createOrder, getAllOrders } from "../controllers/order.controller";
import { authorizeRole, isAutheticated } from '../middleware/auth';

orderRoutes.route('/:courseId')
  .post(isAutheticated, createOrder)
orderRoutes.get('/',isAutheticated, authorizeRole('admin'), getAllOrders)


export default orderRoutes;