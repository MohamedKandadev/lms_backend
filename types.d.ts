import { Request } from "express"
declare namespace Express {
  export interface Request {
    user: any;
  }
  export interface Response {
    user: any;
  }
}