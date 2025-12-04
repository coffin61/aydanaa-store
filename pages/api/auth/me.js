// pages/api/auth/me.js
export default function handler(req, res) {
  // در حالت واقعی باید از session یا JWT بخونی
  // اینجا نمونه‌ی ساده:
  res.status(200).json({
    user: { id: 1, name: 'سهیل' },
    role: 'admin', // نقش: admin | operator | accountant
  });
}