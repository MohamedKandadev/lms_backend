import { Document } from "mongoose";

/*=============================
  Interfaces For Model Schema
===============================*/

export interface INotificationModel extends Document {
  user: object;
  message: string;
  status: string;
}

/*=============================
  Interfaces For Controller
===============================*/