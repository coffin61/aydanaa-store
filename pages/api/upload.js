import formidable from 'formidable';
import cloudinary from 'cloudinary';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

// پیکربندی Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const form = new formidable.IncomingForm({ keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ message: 'خطا در دریافت فایل' });

    const file = files.file;
    if (!file) return res.status(400).json({ message: 'فایلی ارسال نشده' });

    try {
      const result = await cloudinary.v2.uploader.upload(file.filepath, {
        folder: 'products',
      });

      return res.status(200).json({ url: result.secure_url });
    } catch (error) {
      return res.status(500).json({ message: 'خطا در آپلود به Cloudinary', error: error.message });
    }
  });
}