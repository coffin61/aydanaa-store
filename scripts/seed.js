import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { connectDB } from '../lib/db.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';

async function seed() {
  await connectDB();

  // پیدا کردن دسته‌بندی‌ها (اگر قبلاً ساختی)
  const ceramic = await Category.findOne({ slug: 'ceramic' });
  const enamel = await Category.findOne({ slug: 'enamel' });

  await Product.create([
    {
      title: 'گلدان سفید سرامیکی',
      slug: 'white-ceramic-vase',
      description: 'گلدانی زیبا برای دکوراسیون مدرن',
      price: 250000,
      stock: 12,
      image: '/images/vase1.jpg',
      category: ceramic?._id,
    },
    {
      title: 'کاسه مینای لاجوردی',
      slug: 'blue-enamel-bowl',
      description: 'کاسه سنتی با طرح لاجوردی',
      price: 180000,
      stock: 8,
      image: '/images/bowl1.jpg',
      category: enamel?._id,
    },
    {
      title: 'بشقاب سرامیکی طرح گل',
      slug: 'flower-ceramic-plate',
      description: 'بشقاب تزئینی با طرح گل‌های سنتی',
      price: 220000,
      stock: 5,
      image: '/images/plate1.jpg',
      category: ceramic?._id,
    },
  ]);

  console.log('✅ محصولات نمونه ثبت شدند');
  mongoose.connection.close();
}

seed();