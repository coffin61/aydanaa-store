import { connectDB } from '../../../lib/db.js';
import Category from '../../../models/Category.js';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'POST') {
    const form = formidable({ multiples: false, maxFileSize: 2 * 1024 * 1024 }); // 2MB

    form.parse(req, async (err, fields, files) => {
      if (err) return res.status(400).json({ message: '❌ خطا در پردازش فرم یا فایل' });

      const { title, slug, description } = fields;

      if (!title || !slug) {
        return res.status(400).json({ message: 'عنوان و slug الزامی هستند' });
      }

      const exists = await Category.findOne({ slug });
      if (exists) {
        return res.status(409).json({ message: 'این slug قبلاً استفاده شده' });
      }

      let imagePath = null;

      if (files.image) {
        const file = files.image[0];
        const ext = path.extname(file.originalFilename).toLowerCase();
        const allowed = ['.jpg', '.jpeg', '.png', '.webp'];

        if (!allowed.includes(ext)) {
          return res.status(415).json({ message: '❌ فقط فایل‌های تصویری مجاز هستند' });
        }

        const fileName = `${Date.now()}-${file.originalFilename.replace(/\s+/g, '-')}`;
        const newPath = path.join(process.cwd(), 'public', 'uploads', fileName);

        fs.renameSync(file.filepath, newPath);
        imagePath = `/uploads/${fileName}`;
      }

      const category = await Category.create({
        title,
        slug,
        description,
        ...(imagePath && { image: imagePath }),
      });

      return res.status(201).json({ category });
    });
    return;
  }

  if (req.method === 'GET') {
    const categories = await Category.find();
    return res.status(200).json({ categories });
  }

  res.status(405).end();
}