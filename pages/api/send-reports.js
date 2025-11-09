import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'فقط درخواست POST مجاز است' });
  }

  const { csvText, toEmail } = req.body;

  if (!csvText || !toEmail) {
    return res.status(400).json({ message: 'اطلاعات ناقص است' });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: 'mail.example.ir', // ← آدرس SMTP سرویس‌دهنده
      port: 587,
      secure: false,
      auth: {
        user: 'admin@example.ir', // ← ایمیل فرستنده
        pass: 'yourpassword',     // ← رمز عبور یا رمز اپلیکیشن
      },
    });

    await transporter.sendMail({
      from: '"فروشگاه Aydanaa" <admin@example.ir>',
      to: toEmail,
      subject: '📦 گزارش سفارش‌ها',
      text: 'سلام! فایل گزارش سفارش‌ها پیوست شده است.',
      attachments: [
        {
          filename: 'orders-report.csv',
          content: csvText,
        },
      ],
    });

    res.status(200).json({ message: 'ایمیل با موفقیت ارسال شد ✅' });
  } catch (error) {
    console.error('خطا در ارسال ایمیل:', error);
    res.status(500).json({ message: 'ارسال ایمیل ناموفق بود ❌', error: error.message });
  }
}