import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';

export default function EditProfilePage() {
  const { data: session, status } = useSession();
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || '');
      setImage(session.user.image || '');
    }
  }, [session]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/user-profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: session.user.email, name, image }),
    });
    const data = await res.json();
    setMessage(data.message || '✅ اطلاعات ذخیره شد');
  };

  if (status === 'loading') return <div className="p-8">در حال بارگذاری...</div>;
  if (status === 'unauthenticated') return <div className="p-8">لطفاً ابتدا وارد شوید.</div>;

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-xl font-bold mb-4 text-gray-800">ویرایش اطلاعات کاربر</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">نام</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">آدرس تصویر پروفایل</label>
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-4 py-2 rounded"
        >
          ذخیره تغییرات
        </button>
        {message && <p className="text-green-600 text-sm mt-2">{message}</p>}
      </form>
    </div>
  );
}