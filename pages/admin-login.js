import { useState } from 'react';
import { useRouter } from 'next/router';

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const correctPassword = 'admin123'; // رمز عبور ثابت

    if (password === correctPassword) {
      localStorage.setItem('admin-auth', 'true');
      router.push('/admin');
    } else {
      setError('رمز عبور اشتباه است.');
    }
  };

  return (
    <div className="max-w-sm mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6 text-center">ورود مدیر</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">رمز عبور</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border px-4 py-2 rounded"
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 w-full"
        >
          ورود
        </button>
      </form>
    </div>
  );
}