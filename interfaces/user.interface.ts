import { Request } from "express";
import { Document } from "mongoose";

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar: {
    publicId: string;
    url: string;
  },
  role: string;
  isVerified: boolean;
  courses: Array<string>;
  comparePassword: (password: string) => Promise<boolean>;
}

interface IRegistrationBody {
  name: string;
  password: string;
  email: string;
  avatr?: string;
}

interface IActivationToken {
  token: string;
  activationCode: string;
}

interface IActivateRequest {
  activaton_token: string;
  activaton_code: string;
}

interface ILogin {
  email: string;
  password: string;
}

interface ISocialAuth {
  email: string;
  name: string;
  avatar: string;
}

interface IUpdateUserInfo {
  email?: string;
  name?: string;
}

interface IUpdatePassword {
  currentPassword: string;
  newPassword: string;
}

interface IUpdateAvatar {
  avatar: string;
}

export interface IGetUserAuthInfoRequest extends Request {
  user: IUser // or any other type
}

export { 
  IRegistrationBody,
  IActivationToken,
  IActivateRequest,
  ILogin,
  ISocialAuth,
  IUpdateUserInfo,
  IUpdatePassword,
  IUpdateAvatar, 
  IUser
}