import { useState } from 'react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    setMessage(data.message || '✅ اگر ایمیل معتبر باشد، لینک بازیابی ارسال شد');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-xl font-bold mb-4 text-gray-800">فراموشی رمز عبور</h1>
      {message && <p className="text-sm text-purple-700 mb-4">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">ایمیل</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-4 py-2 rounded w-full"
        >
          ارسال لینک بازیابی
        </button>
      </form>
    </div>
  );
}