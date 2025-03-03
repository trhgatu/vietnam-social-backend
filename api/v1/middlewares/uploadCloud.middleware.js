import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import 'dotenv/config';

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});
