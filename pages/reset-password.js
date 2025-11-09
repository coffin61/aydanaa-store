import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export default function ResetPasswordPage() {
  const router = useRouter();
  const { token, email } = router.query;

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setMessage('❌ رمز جدید باید حداقل ۶ کاراکتر باشد');
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage('❌ رمزها با هم مطابقت ندارند');
      return;
    }

    const res = await fetch('/api/reset-password', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, token, newPassword }),
    });

    const data = await res.json();
    setMessage(data.message || '✅ رمز عبور تغییر کرد');
    if (res.ok) {
      setSubmitted(true);
      setTimeout(() => router.push('/login?success=1'), 2000);
    }
  };

  if (!token || !email) {
    return <div className="p-8 text-red-600">❌ لینک بازیابی معتبر نیست</div>;
  }

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-xl font-bold mb-4 text-gray-800">تغییر رمز عبور</h1>
      {message && <p className="text-sm text-purple-700 mb-4">{message}</p>}
      {!submitted && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">رمز جدید</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">تکرار رمز جدید</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-4 py-2 rounded w-full"
          >
            ذخیره رمز جدید
          </button>
        </form>
      )}
    </div>
  );
}