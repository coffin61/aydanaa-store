import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error('MONGODB_URI در env تعریف نشده');

let isConnected = false;

export async function connectDB() {
  if (isConnected) return;

  try {
    await mongoose.connect(uri); // گزینه‌های اضافی حذف شدن
    isConnected = true;
    console.log('✅ اتصال به MongoDB برقرار شد');
  } catch (error) {
    console.error('❌ خطا در اتصال به MongoDB:', error);
    throw error;
  }
}