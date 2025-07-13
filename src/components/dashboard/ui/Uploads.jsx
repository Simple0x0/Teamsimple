import React, { useState, useEffect, useRef } from 'react';
import style from '../../../app/Style';
import { fetchFilesUtil, uploadFile } from '../utils/apiRequest';

export default function Uploads({ type = 'image', New = false, contentType = '', UploadKey = '', onSelect, onUpload = () => {} }) {
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [ImgUploadKey, setImgUploadKey] = useState(UploadKey);
  const inputRef = useRef(null);


  const s = style.uploads;
  const BASE_API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (contentType && ImgUploadKey) fetchFiles();
  }, [contentType, ImgUploadKey]);

  const fetchFiles = async () => {
    try {
      const data = await fetchFilesUtil({ type, contentType, uploadKey: ImgUploadKey });
      const json = await data.json();
      setFileList(json.files || []);
    } catch (err) {
      console.error('Failed to load files', err);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setError('');

    try {
      const uploadKey = ImgUploadKey || 'new';
      const data = await uploadFile({ file, type, contentType, uploadKey });

      if (data.url) {
        setFileList(prev => [data.url, ...prev]);
        onSelect?.(data.url);

        if (!ImgUploadKey){
          const parts = data.url.split('/');
          if (parts.length >= 5) {
            const extractedKey = parts[3]; 
            setImgUploadKey(extractedKey);
            onUpload(extractedKey);
          }
        }
        inputRef.current.value = '';
      } else if (data.error) {
        // Handle error messages returned in response JSON
        setError(data.error);
      } else {
        setError('Unknown upload error');
      }
    } catch (err) {
      // Handle HTTP or network errors and extract message if available
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Upload failed');
      }
    } finally {
      setLoading(false);
    }
  };


  const toDisplayUrl = (relativeUrl) => {
    const parts = relativeUrl.split('/');
    if (parts.length < 5 || parts[1] !== 'uploads') return relativeUrl; 
    
    const contentType = parts[2];
    const uKey = (parts[3]);
    const filePath = parts.slice(4).join('/');
    const finalKey = New ? `${uKey}-hashed` : uKey;
    return `${BASE_API_URL}/api/files/${contentType}/${finalKey}/${filePath}`;
  };

  const copyToClipboard = async (relativeUrl, index) => {
    try {
      const fullUrl = toDisplayUrl(relativeUrl);
      await navigator.clipboard.writeText(fullUrl);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1500);
      onSelect?.(fullUrl);
    } catch (err) {
      console.error('Copy failed', err);
    }
  };

  return (
    <div className={s.wrapper}>
      <div className="col-span-1 rounded border border-slate-700 p-4">
        <label className={s.label}>Upload {type === 'audio' ? 'Podcast Audio (.mp3)' : 'Image ( .jpg, .png, .jpeg )'}</label>
        <div className={s.imageInputWrapper}>
          <input
            ref={inputRef}
            type="file"
            accept={type === 'audio' ? 'audio/*' : 'image/*'}
            onChange={handleUpload}
            className={s.imageInput}
          />
        </div>
        {loading && <p className="text-sm text-yellow-500">Uploading...</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>

      <div className="mt-4">
        {fileList.length === 0 && <p className="text-gray-500 text-sm">No uploaded {type === 'audio' ? 'Podcast' : 'Image'} yet!</p>}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 custom-scrollbar max-h-60 overflow-y-auto p-1 rounded">
          {fileList.map((url, i) => {
            const displayUrl = toDisplayUrl(url);
            return (
              <div
                key={i}
                className="relative bg-slate-900 p-2 rounded hover:bg-slate-700 transition cursor-pointer border border-slate-600"
                onClick={() => copyToClipboard(url, i)}
              >
                <code className="text-xs text-indigo-300 break-all block">{displayUrl}</code>
                {copiedIndex === i && <p className="text-green-400 text-xs mt-1">Copied!</p>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
