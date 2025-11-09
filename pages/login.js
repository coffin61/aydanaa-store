import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function LoginPage() {
  const router = useRouter();
  const success = router.query.success;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (res.error) {
      setErrorMsg('❌ ایمیل یا رمز عبور اشتباه است');
    } else {
      router.push('/');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-xl font-bold mb-4 text-gray-800">ورود به حساب کاربری</h1>

      {success === '1' && (
        <div className="bg-green-100 text-green-700 text-sm px-4 py-2 rounded mb-4">
          رمز عبور شما با موفقیت تغییر کرد ✅ لطفاً با رمز جدید وارد شوید.
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-100 text-red-700 text-sm px-4 py-2 rounded mb-4">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
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
          ورود
        </button>
      </form>
    </div>
  );
}