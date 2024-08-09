import { app } from './app';
import connectDB from './utils/db';
import {v2 as cloudinary} from 'cloudinary';

cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUD_API_KEY as string, 
  api_secret: process.env.CLOUD_API_SECRET 
});
app.listen(process.env.PORT, () => {
  console.log('connect to Port');
  connectDB();
});
