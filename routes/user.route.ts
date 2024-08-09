import express from "express";
const userRoutes = express.Router();

import { 
  registerUser,
  activateUser,
  loginUser,
  logOutUser,
  socialAuth,
  getUserInfo,
  updateUserInfo,
  updatePassword,
  updateAvatar,
  getAllUsers,
  updateRole,
  deleteUser,
  deleteAvatar
} from '../controllers/user.controller';
import { isAutheticated, authorizeRole } from '../middleware/auth';

/*
  ===> Path === api/users/registration
  ==> Register user without activated her account
  ==> Send token to her email address for activated her account
*/
userRoutes.post('/registration', registerUser) 
/*
  ===> Path === api/users/activate-user
  ==> Activated Account 
*/
userRoutes.get('/activate-user/:activaton_token', activateUser) 
userRoutes.post('/login', loginUser)
userRoutes.get('/logout', isAutheticated, logOutUser)
userRoutes.get('/me',isAutheticated, getUserInfo)
userRoutes.post('/social-auth', socialAuth)
userRoutes.put('/update-info-user',isAutheticated, updateUserInfo)
userRoutes.put('/update-password',isAutheticated, updatePassword)
userRoutes.route('/avatar')
.put(isAutheticated, updateAvatar)
.delete(isAutheticated, deleteAvatar)
userRoutes.get('/',isAutheticated, authorizeRole('admin'), getAllUsers)
userRoutes.route('/:userId')
  .put(isAutheticated, authorizeRole('admin'), updateRole)
  .delete(isAutheticated, authorizeRole('admin'), deleteUser)

export default userRoutes;