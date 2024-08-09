import mongoose from "mongoose";
import asyncHandler from 'express-async-handler';

import dotenv from 'dotenv'
dotenv.config()

const dbURL:string = process.env.DB_URL || ''

const connectDB = (async () => {
  await mongoose.connect(dbURL)
    .then(() => {
      console.log('Connect To Database')
    })
})

export default connectDB;