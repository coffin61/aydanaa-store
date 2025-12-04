// pages/api/invoice/[id].js
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { getOrderById } from '../../../models/Order';
import pool from '../../../lib/db';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // گرفتن سفارش از دیتابیس
    const order = await getOrderById(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // گرفتن آیتم‌های سفارش
    const [items] = await pool.query(
      'SELECT * FROM order_items WHERE order_id = ?',
      [order.id]
    );

    // ساخت PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]); // A4
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const { height } = page.getSize();

    let y = height - 50;

    page.drawText('🧾 فاکتور سفارش', {
      x: 50,
      y,
      size: 20,
      font,
      color: rgb(0.2, 0.2, 0.6),
    });
    y -= 30;

    page.drawText(`شماره سفارش: ${order.id}`, { x: 50, y, size: 12, font });
    y -= 20;
    page.drawText(`ایمیل مشتری: ${order.email}`, { x: 50, y, size: 12, font });
    y -= 20;
    page.drawText(`وضعیت: ${order.status}`, { x: 50, y, size: 12, font });
    y -= 30;

    page.drawText('محصولات:', { x: 50, y, size: 14, font });
    y -= 20;

    items.forEach((item) => {
      page.drawText(
        `• ${item.title} × ${item.quantity} = ${(item.price * item.quantity).toLocaleString()} تومان`,
        { x: 60, y, size: 11, font }
      );
      y -= 18;
    });

    y -= 10;
    page.drawText(`مجموع کل: ${order.total.toLocaleString()} تومان`, {
      x: 50,
      y,
      size: 13,
      font,
      color: rgb(0, 0.5, 0),
    });

    const pdfBytes = await pdfDoc.save();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=invoice-${order.id}.pdf`
    );
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error('Invoice error:', error);
    return res.status(500).json({ error: 'خطا در تولید فاکتور' });
  }
}