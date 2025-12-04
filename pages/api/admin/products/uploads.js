// pages/api/admin/products/upload.js
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false, // غیرفعال کردن bodyParser برای آپلود فایل
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  fs.mkdirSync(uploadDir, { recursive: true });

  const form = formidable({
    uploadDir,
    keepExtensions: true,
    multiples: false, // فقط یک فایل
  });

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error('Upload error:', err);
      return res.status(500).json({ error: 'خطا در آپلود' });
    }

    // در نسخه جدید formidable، فایل مستقیم برمی‌گرده
    const file = files.image;
    if (!file) {
      return res.status(400).json({ error: 'فایلی ارسال نشده است' });
    }

    const filename = path.basename(file.filepath);
    return res.status(200).json({ url: `/uploads/${filename}` });
  });
}