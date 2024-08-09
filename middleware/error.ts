import { Request, Response, NextFunction } from 'express'
import ErrorHandler from '../utils/errorHandler';

export const ErrorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Some Error'

  // JWT Expired Error
  if(err.name === 'TokenExpiredError'){
    const message = 'Json Web Token Is expired'
    err = new ErrorHandler(message, 400)
  }
  res.status(err.statusCode || 500).json(err.message)
}