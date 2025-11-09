import kavenegar from '@/lib/kavenegar';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { phone, message } = req.body;

  try {
    await kavenegar.Send({
      message,
      sender: '10004346', // شماره اختصاصی یا عمومی
      receptor: phone,
    });
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}