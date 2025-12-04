import { useState } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setError('⚠️ لطفاً همه فیلدها را پر کنید.');
      return;
    }

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      toast.success('✅ ثبت‌نام موفقیت‌آمیز بود!');
      router.push('/auth/login');
    } else {
      setError(data.error || '❌ خطا در ثبت‌نام');
    }
  };

  return (
    <div className="max-w-sm mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">ثبت‌نام کاربر جدید</h1>

      <input
        type="text"
        placeholder="نام کامل"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border px-3 py-2 mb-2 rounded"
      />
      <input
        type="email"
        placeholder="ایمیل"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border px-3 py-2 mb-2 rounded"
      />
      <input
        type="password"
        placeholder="رمز عبور"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border px-3 py-2 mb-4 rounded"
      />

      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

      <button
        onClick={handleRegister}
        className="bg-green-600 text-white px-4 py-2 rounded w-full"
      >
        ثبت‌نام
      </button>
    </div>
  );
}