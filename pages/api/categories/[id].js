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
  const { id } = req.query;

  if (req.method === 'PUT') {
    const form = formidable({ multiples: false, maxFileSize: 2 * 1024 * 1024 }); // 2MB

    form.parse(req, async (err, fields, files) => {
      if (err) return res.status(400).json({ message: '❌ خطا در پردازش فایل یا فرم' });

      const { title, slug, description } = fields;
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

        // حذف تصویر قبلی (اختیاری)
        const old = await Category.findById(id);
        if (old?.image) {
          const oldPath = path.join(process.cwd(), 'public', old.image);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
      }

      const updated = await Category.findByIdAndUpdate(
        id,
        {
          title,
          slug,
          description,
          ...(imagePath && { image: imagePath }),
        },
        { new: true }
      );

      if (!updated) return res.status(404).json({ message: 'دسته‌بندی یافت نشد' });
      return res.status(200).json({ category: updated });
    });
    return;
  }

  // سایر متدها (GET, DELETE) همون قبلی باقی می‌مونن
}