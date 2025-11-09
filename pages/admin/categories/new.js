import { useState } from 'react';
import { useRouter } from 'next/router';

export default function NewCategoryPage() {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleTitleChange = (e) => {
    const value = e.target.value;
    setTitle(value);
    setSlug(value.toLowerCase().replace(/\s+/g, '-'));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('slug', slug);
    formData.append('description', description);
    if (image) formData.append('image', image);

    const res = await fetch('/api/categories', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();

    if (res.ok) {
      setMessage('✅ دسته‌بندی با موفقیت ثبت شد');
      setTimeout(() => router.push('/admin/categories'), 1500);
    } else {
      setMessage(`❌ خطا: ${data.message || 'ثبت انجام نشد'}`);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8 space-y-6">
      <h1 className="text-2xl font-bold text-blue-700">➕ افزودن دسته‌بندی جدید</h1>

      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
        <input
          type="text"
          placeholder="عنوان دسته"
          value={title}
          onChange={handleTitleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          placeholder="توضیحات"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full border p-2 rounded"
        />
        {preview && (
          <img src={preview} alt="پیش‌نمایش" className="w-32 h-32 object-cover rounded" />
        )}
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          ثبت دسته‌بندی
        </button>
      </form>

      {message && <p className="text-sm text-center pt-4">{message}</p>}
    </div>
  );
}