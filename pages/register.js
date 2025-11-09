import { useState } from 'react';
import { useRouter } from 'next/router';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setMessage('❌ رمز عبور باید حداقل ۶ کاراکتر باشد');
      return;
    }

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name, password }),
    });

    const data = await res.json();
    if (res.ok) {
      router.push('/login?success=registered');
    } else {
      setMessage(data.message || '❌ خطا در ثبت‌نام');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-xl font-bold mb-4 text-gray-800">ثبت‌نام</h1>
      {message && <p className="text-sm text-red-600 mb-4">{message}</p>}
      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">نام</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
            required
          />
        </div>
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
        <div>
          <label className="block text-sm text-gray-600 mb-1">رمز عبور</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-4 py-2 rounded w-full"
        >
          ثبت‌نام
        </button>
      </form>
    </div>
  );
}