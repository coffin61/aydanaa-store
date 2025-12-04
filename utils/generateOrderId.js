// utils/generateOrderId.js

/**
 * تابع تولید شناسه سفارش
 * خروجی: رشته‌ای مثل ORD-20251202-1342
 */
export default function generateOrderId() {
  const now = new Date();

  // ساخت رشته تاریخ به فرمت YYYYMMDD
  const datePart = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0')
  ].join('');

  // ساخت رشته زمان به فرمت HHMM
  const timePart = [
    String(now.getHours()).padStart(2, '0'),
    String(now.getMinutes()).padStart(2, '0')
  ].join('');

  // عدد تصادفی ۴ رقمی
  const randomPart = String(Math.floor(Math.random() * 10000)).padStart(4, '0');

  return `ORD-${datePart}${timePart}-${randomPart}`;
}