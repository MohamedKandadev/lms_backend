import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from 'bcryptjs'
import { IUser } from "../interfaces/user.interface";

const emailPatternRegex: RegExp = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

const userSchema: Schema<IUser> = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Please enter your name']
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    validate: {
      validator: (value: string) => {
        return emailPatternRegex.test(value);
      },
      message: 'Please enter a valid email'
    },
    unique: true
  },
  password: {
    type: String,
    minLength: [6, 'Password must be at least 6 characters'],
    select: false,
  },
  avatar: {
    publicId: String,
    url: String,
  },
  role:{
    type: String,
    default: 'user'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  courses: [{type: mongoose.Types.ObjectId, ref: 'Course'}]
}, {timestamps: true})

// Hash password befor save user
userSchema.pre<IUser>("save",async function(next) {
  if(!this?.isModified('password')) next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
})

// Compare password
userSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean>{
  return await bcrypt.compare(enteredPassword, this.password);
}

const userModel: Model<IUser> = mongoose.model('User', userSchema);
export default userModel;
