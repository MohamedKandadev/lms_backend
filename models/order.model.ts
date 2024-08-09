import mongoose, { Document, Schema, Model } from "mongoose";

import { IOrderModel } from "../interfaces/order.interface"; 

const orderSchema = new Schema<IOrderModel>({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User"
  },
  course: {
    type: mongoose.Types.ObjectId,
    ref: "Course"
  },
  payament_info: {
    type: Object
  }
}, {timestamps: true})

const orderModel = mongoose.model('Order', orderSchema);
export default orderModel;