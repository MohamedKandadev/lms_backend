import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import jwt, {Secret} from 'jsonwebtoken'; 
import cloudinary from 'cloudinary';

import ErrorHandler from '../utils/errorHandler';
import User from '../models/user.model';
import sendMail from '../utils/sendMail';
import generateToken from '../utils/generateToken';
import { 
  IRegistrationBody,
  IActivationToken,
  IActivateRequest,
  ILogin,
  ISocialAuth,
  IUpdateUserInfo,
  IUpdatePassword,
  IUpdateAvatar, 
  IUser
} from '../interfaces/user.interface';


interface userRequest extends Request {
  user?: any
}

export const registerUser = asyncHandler(async (req: userRequest, res: Response, next: NextFunction) => {
  const { email, password, name } = req.body as IRegistrationBody;
  const isEmailExist = await User.findOne({ email });
  if(isEmailExist) {
    return next(new ErrorHandler("Email already exists", 400));
  }
  const user: IRegistrationBody = {email, password, name}
  const newUser = new User(user); 
  await newUser.save();

  const activationToken = createActivationToken(user)
  const { activationCode, token } = activationToken;
  const data = {user: {name: user.name}, token}
  await sendMail({
    email: user.email,
    subject: 'Activate your account',
    template: 'emailVeriefier.ejs',
    data
  });
  res.status(201).json({
    message: `Please check your email address: ${user.email} to ativate your account`, 
  });
})


export const createActivationToken = (user: any): IActivationToken => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
  const token = jwt.sign(
    {user, activationCode},
    process.env.ACTIVATION_SECRET as Secret,
    {expiresIn: "20m"}
  );
  return {token, activationCode}
}


export const activateUser = asyncHandler(async (req: userRequest, res: Response, next: NextFunction) =>{
  const { activaton_token } = req.params;
  const newUser: {user: IUser, activationCode: string} = jwt.verify(
    activaton_token,
    process.env.ACTIVATION_SECRET as string
  ) as {user: IUser, activationCode: string}
  const { email } = newUser.user;
  const user = await User.findOne({email})
  if(!user) return next(new ErrorHandler('Email not found!!', 400))
  if(user?.isVerified) return next(new ErrorHandler('This account is already activated', 400))
  user.isVerified = true;
  await user?.save();
  res.status(200).json({message: 'Account activated successfully', user})
})

export const loginUser = asyncHandler(async (req: userRequest, res: Response, next: NextFunction) => {
  const {email, password} = req.body as ILogin;
  if(!email || !password){
    return next(new ErrorHandler('Please enter email and password', 400))
  }
  const user: IUser = await User.findOne({email}).select('+password')
  if(!user){
    return next(new ErrorHandler('Email not found', 400))
  }else if(!user?.isVerified){
    return next(new ErrorHandler('Account not activated check your email', 400))
  }
  
    const isPasswordMatch = user ? await user.comparePassword(password) : false;
    if(!isPasswordMatch)
      return next(new ErrorHandler('Invalid email or password', 400))
  generateToken(res, user)

  res.status(200).json({message:'User login successful', user });
})

export const logOutUser = asyncHandler(async (req: userRequest, res: Response, next: NextFunction) => {
  console.log('log out')
  res.cookie('jwt_login', '', {maxAge: 1});
  res.status(200).json('User logout successful');
})

export const getUserInfo = asyncHandler(async (req: userRequest, res: Response, next: NextFunction) => {
  console.log(req.user)
  res.json(req.user)
})


export const socialAuth = asyncHandler(async (req: userRequest, res: Response, next: NextFunction) =>{
  const { email, name, avatar } = req.body as ISocialAuth;
  console.log(email, name, avatar)
  const user = await User.findOne({email})
  if(user) generateToken(res, user);
  else {
    const newUser = new User({ email, name, avatar:{url: avatar} });
    await newUser.save();
    generateToken(res, newUser);
  }
  res.status(200).json({message: 'Logged in with successfully', user});
})


export const updateUserInfo = asyncHandler(async (req: userRequest, res: Response, next: NextFunction) =>{
  const { email, name } = req.body as IUpdateUserInfo;
  console.log(name)
  const user = await User.findById(req.user?._id);
  if(email && user){
    const emailExiste = await User.findOne({email})
    if(emailExiste){
      return next(new ErrorHandler('Email Already Existe', 400))
    }
    user.email = email;
  }
  if(name) user?.name = name;
  await user?.save();
  res.status(200).json('User update successful');
})


export const updatePassword =  asyncHandler(async (req: userRequest, res: Response, next: NextFunction) => {
  const { currentPassword, newPassword } = req.body as IUpdatePassword;
  console.log({ currentPassword, newPassword })
  if(!currentPassword || !newPassword ){
    return next(new ErrorHandler('Please enter old and new password', 400))
  }
  const user = await User.findById(req.user?._id).select("+password");
  if(user?.password === undefined){
    return next(new ErrorHandler('Invalid User', 400))
  }
  const currentPasswordMatchd = await user.comparePassword(currentPassword || '');
  if(!currentPasswordMatchd){
    return next(new ErrorHandler('Invalid old password', 400))
  }
  user.password = newPassword;
  await user.save();
  res.status(200).json('Update password successfully')
})


export const updateAvatar =  asyncHandler(async (req: userRequest, res: Response, next: NextFunction) =>{
  const { avatar } =  req.body as IUpdateAvatar;
  const user = await User.findById(req.user?._id)
  if(avatar && user){
    if(user?.avatar?.publicId){
      await cloudinary.v2.uploader.destroy(user?.avatar?.publicId)
    }
    const myCloud = await cloudinary.v2.uploader.upload(avatar, {
      folder: "avatars",
      width: 150
    });
    user.avatar = {
      publicId: myCloud.public_id,
      url: myCloud.secure_url
    }
    await user.save();
  }
  res.status(200).json('Update profile picture successfully')
})

export const deleteAvatar =  asyncHandler(async (req: userRequest, res: Response, next: NextFunction) =>{
  const user = await User.findById(req.user?._id)
  if(user){
    if(user?.avatar?.publicId){
      await cloudinary.v2.uploader.destroy(user?.avatar?.publicId)
    }
    user.avatar = {
      publicId: '',
      url: ''
    }
    await user.save();
  }
  res.status(200).json('Delete profile picture successfully')
})

export const getAllUsers =  asyncHandler(async (req: userRequest, res: Response, next: NextFunction) =>{
  const users = await User.find();
  res.status(200).json(users);
})

export const updateRole =  asyncHandler(async (req: userRequest, res: Response, next: NextFunction) =>{
  const { userId } = req.params;
  const { role } = req.body;
  const user = await User.findByIdAndUpdate(userId, { role }, { new: true });
  res.status(200).json({message: 'update role successfully', user});
})

export const deleteUser =  asyncHandler(async (req: userRequest, res: Response, next: NextFunction) =>{
  const { userId } = req.params;
  const user = await User.findById(userId);
  if(!user) return next(new ErrorHandler('User not found', 400))
  await user.deleteOne({ userId })
  res.status(200).json({message: 'User delete successfully'});
})