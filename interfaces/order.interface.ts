import { Document } from "mongoose";

/*=============================
  Interfaces For Model Schema
===============================*/

export interface IOrderModel extends Document {
  user: object;
  course: object;
  payament_info: object;
}

/*=============================
  Interfaces For Controller
===============================*/