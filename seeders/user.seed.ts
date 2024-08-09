import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import connectDb from '../utils/db';
import dotenv from 'dotenv'
dotenv.config()


import User from '../models/user.model';
let users = [
  {
    name: 'Kandad user',
    email: 'kandad.user@gmail.com',
    password: 'User@@123',
    role: 'user'
  },
  {
    name: 'Kandad admin',
    email: 'kandad.admin@gmail.com',
    password: 'Admin@@123',
    role: 'admin'
  },
]

const hashedUsers = users.map(async (user) => {
  const hashedPassword = await bcrypt.hash(user.password,12);
  user.password = hashedPassword;
  return user;
});

connectDb();
const addUsers: any = asyncHandler(async () => {
  users = await Promise.all(hashedUsers)
  await User.insertMany(users);
})
// addUsers();
export default addUsers;