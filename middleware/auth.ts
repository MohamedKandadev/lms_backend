import { Response, Request, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User from '../models/user.model';
import ErrorHandler from '../utils/errorHandler';

export const isAutheticated = (async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.jwt_login;
  console.log(token)
  if(token){
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    req.user = await User.findById(decoded.user._id);
    next();
  }else{
    next(new ErrorHandler('Not authorized, Invalid token', 400))
  }
})

// Validate user role
export const authorizeRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if(!roles.includes(req.user?.role || '')){
      next(new ErrorHandler('Not authorized to access this resource', 400))
    }
    next();
  }
}