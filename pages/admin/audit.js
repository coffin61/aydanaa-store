// pages/admin/audit.js
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export default function AuditPage() {
  const { data: session } = useSession();
  const [audits, setAudits] = useState([]);

  useEffect(() => {
    fetch('/api/audit').then(r => r.json()).then(setAudits);
  }, []);

  if (!session || session.user.role !== 'admin') return <div className="p-6 text-red-600">⛔ دسترسی محدود</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">گزارش تغییرات</h1>
      <table className="w-full border">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-2 border">زمان</th>
            <th className="p-2 border">کاربر</th>
            <th className="p-2 border">موجودیت</th>
            <th className="p-2 border">شناسه</th>
            <th className="p-2 border">عملیات</th>
            <th className="p-2 border">تغییرات</th>
          </tr>
        </thead>
        <tbody>
          {audits.map(a => (
            <tr key={a.id}>
              <td className="p-2 border">{new Date(a.created_at).toLocaleString()}</td>
              <td className="p-2 border">{a.user_name || '-'}</td>
              <td className="p-2 border">{a.entity}</td>
              <td className="p-2 border">{a.entity_id}</td>
              <td className="p-2 border">{a.action}</td>
              <td className="p-2 border"><pre className="whitespace-pre-wrap text-xs">{JSON.stringify(a.changes, null, 2)}</pre></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}