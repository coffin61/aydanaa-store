export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { amount, description, callback_url } = req.body;

  const response = await fetch('https://api.zarinpal.com/pg/v4/payment/request.json', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      merchant_id: process.env.ZARINPAL_MERCHANT_ID,
      amount,
      description,
      callback_url,
    }),
  });

  const result = await response.json();
  if (result.data.code === 100) {
    res.status(200).json({
      authority: result.data.authority,
      payUrl: `https://www.zarinpal.com/pg/StartPay/${result.data.authority}`,
    });
  } else {
    res.status(400).json({ error: result.errors.message });
  }
}