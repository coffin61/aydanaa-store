// pages/api/send-invoice.js
import { Resend } from 'resend';
import jsPDF from 'jspdf';

const resend = new Resend('your-resend-api-key');

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { order, email } = req.body;
  if (!order || !email) return res.status(400).json({ error: 'اطلاعات ناقص است' });

  // ساخت PDF
  const doc = new jsPDF();
  doc.setFontSize(12);
  doc.text(`فاکتور سفارش #${order.id}`, 15, 20);
  let y = 30;
  doc.text(`تاریخ: ${new Date(order.createdAt).toLocaleString('fa-IR')}`, 15, y); y += 6;
  doc.text(`وضعیت: ${order.status}`, 15, y); y += 6;
  doc.text(`مبلغ: ${order.total.toLocaleString()} تومان`, 15, y); y += 10;
  order.items.forEach((item) => {
    doc.text(`${item.title} - ${item.quantity} × ${item.price.toLocaleString()} تومان`, 15, y);
    y += 6;
  });

  const pdfBase64 = doc.output('datauristring').split(',')[1];

  await resend.emails.send({
    from: 'Aydanaa Store <noreply@aydanaa.ir>',
    to: email,
    subject: `فاکتور سفارش #${order.id}`,
    html: `<p>فاکتور سفارش شما در فایل ضمیمه قرار دارد.</p>`,
    attachments: [
      {
        filename: `invoice-${order.id}.pdf`,
        content: pdfBase64,
        encoding: 'base64',
      },
    ],
  });

  res.status(200).json({ success: true });
}