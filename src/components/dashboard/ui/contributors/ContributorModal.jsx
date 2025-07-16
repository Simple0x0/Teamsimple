import React, { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { postContributor } from '../../utils/apiContributorRequests';
import Uploads from '../Uploads';
import MessageToast from '../MessageToast';
import style from '../../../../app/Style';

export default function ContributorModal({ isOpen, onClose, initialContributor = null, onUpdate, onSuccess }) {
  const isEdit = !!initialContributor;
  const s = style.contributorModal;

  const [meta, setMeta] = useState({});
  const [socialLinks, setSocialLinks] = useState([]);
  const [platform, setPlatform] = useState('');
  const [username, setUsername] = useState('');
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success', duration: 3000 });

  useEffect(() => {
    if (isEdit && initialContributor) {
      setMeta(initialContributor);
      if (Array.isArray(initialContributor.SocialLinks)) {
        setSocialLinks(initialContributor.SocialLinks);
      }
    } else {
      setMeta({ Type: 'Guest' });
      setSocialLinks([]);
    }
  }, [isOpen, initialContributor]);

  const handleChange = (field, value) => {
    setMeta(prev => ({ ...prev, [field]: value }));
  };

  const handleUploadKey = (key) => {
    setMeta(prev => ({ ...prev, UploadKey: key }));
  };

  const handleAddSocial = () => {
    if (platform && username) {
      setSocialLinks(prev => [...prev, { Platform: platform, URL: username }]);
      setPlatform('');
      setUsername('');
    }
  };

  const handleRemoveSocial = (index) => {
    setSocialLinks(prev => prev.filter((_, i) => i !== index));
  };

  
  const handleSubmit = async () => {
    const contributorData = {
      ...meta,
      SocialLinks: socialLinks,
    };

    const result = await postContributor({
      action: isEdit ? 'edit' : 'new',
      contributorData,
    });

    if (result.success) {
      // If the backend doesn't return the contributor, fallback to the local copy
      console.log(result);
      if (onSuccess) onSuccess(result.data.message, contributorData);
      setToast({ visible: true, message: result.data.message, type: 'success', duration: 3000 });
      onClose();
    } else {
      setToast({ visible: true, message: result.error, type: 'failure', duration: 5000 });
    }
  };


  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className={s.Dialog} onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className={s.BGDim}/>
        </Transition.Child>

        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Dialog.Panel className={s.panel}>
              <Dialog.Title className={s.title}>{isEdit ? 'Edit Contributor' : 'Add New Contributor'}</Dialog.Title>

              <div className={s.formGroup}>
                <label className={s.label}>Username</label>
                <input type="text" className={s.input} value={meta.Username || ''} onChange={e => handleChange('Username', e.target.value)} />
              </div>

              <div className={s.formGroup}>
                <label className={s.label}>Full Name</label>
                <input type="text" className={s.input} value={meta.FullName || ''} onChange={e => handleChange('FullName', e.target.value)} />
              </div>

              <div className={s.formGroup}>
                <label className={s.label}>Bio</label>
                <textarea className={s.textarea} value={meta.Bio || ''} onChange={e => handleChange('Bio', e.target.value)} />
              </div>

              <div className={s.formGroup}>
                <label className={s.label}>Type</label>
                <select className={s.select} value={meta.Type || 'Guest'} onChange={e => handleChange('Type', e.target.value)}>
                  {['Guest', 'Author', 'Editor', 'Speaker', 'Member', 'Contributor'].map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className={s.formGroup}>
                <label className={s.label}>Upload Profile Picture</label>
                <Uploads type="image" contentType="contributors" UploadKey={meta.UploadKey} onUpload={handleUploadKey} />
              </div>

              <div className={s.formGroup}>
                <label className={s.label}>Profile Picture Link</label>
                <input type="text" className={s.input} value={meta.ProfilePicture || ''} onChange={e => handleChange('ProfilePicture', e.target.value)} />
              </div>

              <div className={s.formGroup}>
                <label className={s.label}>Social Links</label>
                <div className="flex gap-2 mb-2">
                  <input type="text" placeholder="Platform" className="flex-1 px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" value={platform} onChange={e => setPlatform(e.target.value)} />
                  <input type="text" placeholder="URL" className="flex-1 px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" value={username} onChange={e => setUsername(e.target.value)} />
                  <button type="button" onClick={handleAddSocial} className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-500 transition">Add</button>
                </div>
                <ul className="space-y-2">
                  {socialLinks.map((link, idx) => (
                    <li key={idx} className="flex items-center justify-between gap-2">
                      <span className="text-gray-200 text-sm">{link.Platform}: {link.URL}</span>
                      <button type="button" onClick={() => handleRemoveSocial(idx)} className="text-sm text-red-400 hover:text-red-300">Remove</button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={s.actions}>
                <button type="button" className={s.cancelBtn} onClick={onClose}>Cancel</button>
                <button type="button" className={s.saveBtn} onClick={handleSubmit}>{isEdit ? 'Update' : 'Create'}</button>
              </div>
            </Dialog.Panel>
          </div>
        </div>

        {toast.visible && (
          <MessageToast
            message={toast.message}
            duration={toast.duration}
            type={toast.type}
            onClose={() => setToast(prev => ({ ...prev, visible: false }))}
          />
        )}
      </Dialog>
    </Transition.Root>
  );
}
