import { useEffect, useState } from 'react';
import style from '../../../../app/Style';
import MessageToast from '../MessageToast';

export default function PlatformContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState([]);

  useEffect(() => {
    fetch('/api/contacts')
      .then(res => res.json())
      .then(data => {
        setContacts(data.contacts || []);
        setForm(data.contacts || []);
        setLoading(false);
      });
  }, []);

  const handleChange = (idx, field, value) => {
    setForm(f => f.map((c, i) => i === idx ? { ...c, [field]: value } : c));
  };

  const handleAdd = () => {
    setForm(f => [...f, { Platform: '', Value: '', URL: '', Icon: '' }]);
  };

  const handleRemove = (idx) => {
    setForm(f => f.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    const res = await fetch('/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contacts: form }),
    });
    const data = await res.json();
    if (data.success) {
      setToast({ visible: true, message: 'Contacts updated!', type: 'success' });
      setContacts(form);
      setEditing(false);
    } else {
      setToast({ visible: true, message: data.message || 'Failed to update contacts', type: 'failure' });
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className={style.section}>
      <h2 className={style.title}>Platform Contacts & Social Links</h2>
      {toast.visible && <MessageToast {...toast} onClose={() => setToast(t => ({ ...t, visible: false }))} />}
      {!editing ? (
        <>
          <ul className="divide-y divide-gray-700">
            {contacts.map((c, i) => (
              <li key={i} className="py-2 flex items-center gap-4">
                <span className="font-bold text-lime-400">{c.Platform}</span>
                <span>{c.Value}</span>
                <a href={c.URL} className="text-blue-400 underline" target="_blank" rel="noopener noreferrer">{c.URL}</a>
                <span className="text-gray-400">{c.Icon}</span>
              </li>
            ))}
          </ul>
          <button className={style.actionBtn} onClick={() => setEditing(true)}>Edit</button>
        </>
      ) : (
        <>
          <table className="w-full text-sm mb-4">
            <thead>
              <tr>
                <th>Platform</th><th>Value</th><th>URL</th><th>Icon</th><th></th>
              </tr>
            </thead>
            <tbody>
              {form.map((c, i) => (
                <tr key={i}>
                  <td><input value={c.Platform} onChange={e => handleChange(i, 'Platform', e.target.value)} className="bg-slate-800 text-white px-2 py-1 rounded" /></td>
                  <td><input value={c.Value} onChange={e => handleChange(i, 'Value', e.target.value)} className="bg-slate-800 text-white px-2 py-1 rounded" /></td>
                  <td><input value={c.URL} onChange={e => handleChange(i, 'URL', e.target.value)} className="bg-slate-800 text-white px-2 py-1 rounded" /></td>
                  <td><input value={c.Icon} onChange={e => handleChange(i, 'Icon', e.target.value)} className="bg-slate-800 text-white px-2 py-1 rounded" /></td>
                  <td><button onClick={() => handleRemove(i)} className="text-red-400">Remove</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className={style.actionBtn} onClick={handleAdd}>+ Add</button>
          <button className={style.actionBtn} onClick={handleSave}>Save</button>
          <button className={style.actionBtn} onClick={() => { setEditing(false); setForm(contacts); }}>Cancel</button>
        </>
      )}
    </div>
  );
}