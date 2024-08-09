import { Response } from 'express';
import jwt from 'jsonwebtoken';
require('dotenv').config();

import { IUser } from '../interfaces/user.interface'
const generateToken = (res: Response, user: IUser) => {
  const token = jwt.sign({user}, process.env.JWT_SECRET as string, {expiresIn: '30d'})
  res.cookie('jwt_login', token, {
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000
  })
}

export default generateToken;