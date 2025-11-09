import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { connectDB } from '../lib/db.js';
import Category from '../models/Category.js';

async function seedCategories() {
  await connectDB();

  await Category.create([
    {
      title: 'سرامیک',
      slug: 'ceramic',
      description: 'محصولات سرامیکی دست‌ساز و تزئینی',
    },
    {
      title: 'میناکاری',
      slug: 'enamel',
      description: 'ظروف سنتی با طرح‌های مینای لاجوردی',
    },
    {
      title: 'شیشه',
      slug: 'glass',
      description: 'محصولات شیشه‌ای دکوراتیو و کاربردی',
    },
  ]);

  console.log('✅ دسته‌بندی‌های نمونه ثبت شدند');
  mongoose.connection.close();
}

seedCategories();