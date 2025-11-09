import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export default function OrderDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  const { data: session, status } = useSession();

  const [order, setOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      fetch(`/api/orders/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setOrder(data);
          setNewStatus(data.status);
          setNote(data.note || '');
        });
    }
  }, [id]);

  const handleUpdate = async () => {
    if (!session?.user?.email) {
      alert('ابتدا وارد حساب شوید');
      return;
    }

    setSaving(true);
    const res = await fetch(`/api/orders/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-user': session.user.email, // 👈 گرفتن اپراتور از session
      },
      body: JSON.stringify({ status: newStatus, note }),
    });
    const updated = await res.json();
    setOrder(updated);
    setSaving(false);
    alert('✅ تغییرات ذخیره شد');
  };

  const handleDelete = async () => {
    if (!confirm('آیا مطمئن هستی که می‌خوای این سفارش حذف بشه؟')) return;
    setDeleting(true);
    const res = await fetch(`/api/orders/${id}`, { method: 'DELETE' });
    const result = await res.json();
    alert(result.message);
    router.push('/orders');
  };

  if (status === 'loading') return <p className="p-8">در حال بررسی دسترسی...</p>;
  if (!session) return <p className="p-8 text-red-600">⛔ دسترسی غیرمجاز. لطفاً وارد شوید.</p>;
  if (!order) return <p className="p-8">در حال بارگذاری سفارش...</p>;

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-6">
      <h1 className="text-2xl font-bold text-red-600">📄 جزئیات سفارش</h1>

      {/* اطلاعات سفارش */}
      <div className="bg-white shadow p-4 rounded space-y-2">
        <p><strong>شناسه:</strong> {order._id}</p>
        <p><strong>نام مشتری:</strong> {order.customer.name}</p>
        <p><strong>تلفن:</strong> {order.customer.phone}</p>
        <p><strong>آدرس:</strong> {order.customer.address}</p>
        <p><strong>تاریخ:</strong> {new Date(order.date).toLocaleString('fa-IR')}</p>
        <p><strong>وضعیت فعلی:</strong> {order.status}</p>
        <p><strong>مبلغ کل:</strong> {order.total.toLocaleString()} تومان</p>
        {order.note && <p><strong>یادداشت:</strong> {order.note}</p>}
      </div>

      {/* فرم ویرایش وضعیت و یادداشت */}
      <div className="bg-white shadow p-4 rounded space-y-4">
        <label className="block font-medium">ویرایش وضعیت سفارش:</label>
        <select
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
          className="border px-4 py-2 rounded"
        >
          <option value="در حال پردازش">در حال پردازش</option>
          <option value="ارسال شده">ارسال شده</option>
          <option value="لغو شده">لغو شده</option>
        </select>

        <label className="block font-medium mt-4">یادداشت سفارش:</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={4}
          className="border w-full px-4 py-2 rounded"
          placeholder="یادداشت داخلی برای این سفارش..."
        />

        <button
          onClick={handleUpdate}
          disabled={saving}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {saving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
        </button>
      </div>

      {/* دکمه حذف سفارش */}
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        {deleting ? 'در حال حذف...' : '🗑 حذف سفارش'}
      </button>

      {/* آیتم‌های سفارش */}
      <div>
        <h2 className="text-xl font-semibold mt-8 mb-2">🛍 آیتم‌های سفارش</h2>
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">محصول</th>
              <th className="border p-2">تعداد</th>
              <th className="border p-2">قیمت واحد</th>
              <th className="border p-2">دسته‌بندی</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, index) => (
              <tr key={index}>
                <td className="border p-2">{item.title}</td>
                <td className="border p-2">{item.quantity}</td>
                <td className="border p-2">{item.price.toLocaleString()} تومان</td>
                <td className="border p-2">{item.category || 'نامشخص'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* تاریخچه تغییرات */}
      {order.history && order.history.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mt-8 mb-2">🕓 تاریخچه تغییرات</h2>
          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">فیلد</th>
                <th className="border p-2">مقدار قبلی</th>
                <th className="border p-2">مقدار جدید</th>
                <th className="border p-2">زمان تغییر</th>
                <th className="border p-2">اپراتور</th>
              </tr>
            </thead>
            <tbody>
              {order.history
                .slice()
                .reverse()
                .map((h, i) => (
                  <tr key={i}>
                    <td className="border p-2">{h.field}</td>
                    <td className="border p-2">{h.oldValue || '—'}</td>
                    <td className="border p-2">{h.newValue || '—'}</td>
                    <td className="border p-2">
                      {new Date(h.changedAt).toLocaleString('fa-IR')}
                    </td>
                    <td className="border p-2">{h.changedBy || '—'}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}