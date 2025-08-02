import { useEffect, useState } from 'react';
import style from '../../../../app/Style';
import MessageToast from '../MessageToast';
import Loading from '../../../public/ui/Loading';
import { fetchPlatformContacts, updatePlatformContacts } from '../../utils/apiPlatformContact';

export default function PlatformContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState([]);

  useEffect(() => {
    fetchPlatformContacts().then(data => {
      if (Array.isArray(data)) {
        setContacts(data);
        setForm(data);
      }
      setLoading(false);
    });
  }, []);

  const handleChange = (idx, field, value) => {
    setForm(f => f.map((c, i) => i === idx ? { ...c, [field]: value } : c));
  };

  const handleAdd = () => {
    setForm(f => [...f, { Platform: '', Handle: '', URL: '', Icon: '' }]);
  };

  const handleRemove = (idx) => {
    setForm(f => f.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    const res = await updatePlatformContacts({ contacts: form, action: 'edit' });
    if (res.success) {
      setToast({ visible: true, message: 'Contacts updated!', type: 'success' });
      setContacts(form);
      setEditing(false);
    } else {
      setToast({ visible: true, message: res.error || 'Failed to update contacts', type: 'failure' });
    }
  };

  if (loading) return <Loading />;

  return (
    <div className={style.platformContacts.wrapper}>
      <h2 className={style.platformContacts.title}>Platform Contacts & Social Links</h2>
      {toast.visible && <MessageToast {...toast} onClose={() => setToast(t => ({ ...t, visible: false }))} />}
      <div className={style.platformContacts.list}>
        <div className="grid grid-cols-4 gap-2 mb-2">
          <span className={style.platformContacts.th}>Platform Name</span>
          <span className={style.platformContacts.th}>Handle</span>
          <span className={style.platformContacts.th}>Link</span>
          <span className={style.platformContacts.th}>Icon</span>
        </div>

        {(editing ? form : contacts).map((c, i) => (
          <div key={i} className="grid grid-cols-4 gap-2 w-full items-stretch bg-slate-900 rounded-lg p-2 mb-2 border border-slate-800">
            {editing ? (
              <>
                <input
                  value={c.Platform}
                  onChange={e => handleChange(i, 'Platform', e.target.value)}
                  className={style.platformContacts.input}
                  placeholder="Platform (e.g. Twitter)"
                />
                <input
                  value={c.Handle}
                  onChange={e => handleChange(i, 'Handle', e.target.value)}
                  className={style.platformContacts.input}
                  placeholder="Handle or Email/Phone"
                />
                <input
                  value={c.URL}
                  onChange={e => handleChange(i, 'URL', e.target.value)}
                  className={style.platformContacts.input}
                  placeholder="URL (https://...)"
                />
                <div className="flex items-center gap-2">
                  <input
                    value={c.Icon}
                    onChange={e => handleChange(i, 'Icon', e.target.value)}
                    className={style.platformContacts.input}
                    placeholder="Icon (fa-...)"
                  />
                  <button onClick={() => handleRemove(i)} className={style.platformContacts.removeBtn}>Remove</button>
                </div>
              </>
            ) : (
              <>
                <span className={style.platformContacts.platform}>{c.Platform}</span>
                <span className={style.platformContacts.handle}>{c.Handle}</span>
                <a href={c.URL} className={style.platformContacts.url} target="_blank" rel="noopener noreferrer">{c.URL}</a>
                <span className={style.platformContacts.icon}>{c.Icon}</span>
              </>
            )}
          </div>
        ))}
      </div>
      <div className={style.platformContacts.btnRow}>
        {editing ? (
          <>
            <button className={style.platformContacts.actionBtn} onClick={handleAdd}>+ Add</button>
            <button className={style.platformContacts.actionBtn} onClick={handleSave}>Save</button>
            <button className={style.platformContacts.actionBtn} onClick={() => { setEditing(false); setForm(contacts); }}>Cancel</button>
          </>
        ) : (
          <button className={style.platformContacts.actionBtn} onClick={() => setEditing(true)}>Edit</button>
        )}
      </div>
    </div>
  );
} 
