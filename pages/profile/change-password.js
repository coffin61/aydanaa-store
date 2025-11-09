import { useSession } from 'next-auth/react';
import { useState } from 'react';

export default function ChangePasswordPage() {
  const { data: session, status } = useSession();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setMessage('❌ رمز جدید باید حداقل ۶ کاراکتر باشد');
      return;
    }

    const res = await fetch('/api/change-password', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: session.user.email,
        currentPassword,
        newPassword,
      }),
    });

    const data = await res.json();
    setMessage(data.message || '✅ رمز عبور بروزرسانی شد');
  };

  if (status === 'loading') return <div className="p-8">در حال بارگذاری...</div>;
  if (status === 'unauthenticated') return <div className="p-8">لطفاً ابتدا وارد شوید.</div>;

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-xl font-bold mb-4 text-gray-800">تغییر رمز عبور</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">رمز فعلی</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
            required
          />
        </div>
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
        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-4 py-2 rounded"
        >
          ذخیره رمز جدید
        </button>
        {message && <p className="text-sm mt-2 text-purple-700">{message}</p>}
      </form>
    </div>
  );
}