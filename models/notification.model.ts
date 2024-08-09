import mongoose, { Document, Schema, Model } from "mongoose";

import { INotificationModel } from "../interfaces/notification.interface"; 

const notificationSchema = new Schema<INotificationModel>({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User"
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'unread'
  }
}, {timestamps: true})

const notificationModel = mongoose.model('Notification', notificationSchema);
export default notificationModel;