import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ContentMeta from '../ContentMeta';
import Uploads from '../Uploads';
import { postEvent } from '../../utils/apiEventRequest';
import MessageToast from '../MessageToast';
import style from '../../../../app/Style';

export default function EventAdd() {
  const navigate = useNavigate();
  const [meta, setMeta] = useState({});
  const [selectedTags, setSelectedTags] = useState([]);
  const [toastConfig, setToastConfig] = useState({
    message: '',
    duration: 3000,
    visible: false,
    type: 'success',
    redirect: '',
  });

  const handleMetaChange = (updatedMeta) => {
    setMeta(updatedMeta);
  };

  const handleUploadKey = (key) => {
    setMeta((prev) => ({ ...prev, UploadKey: key }));
  };

  const preparePayload = () => ({
    ...meta,
    Tags: selectedTags.map((tag) => tag.name || tag),
  });

  const showToast = ({ message, duration = 6000, type = 'success', redirect = '' }) => {
    setToastConfig({ message, duration, type, redirect, visible: true });
    setTimeout(() => {
      setToastConfig((prev) => ({ ...prev, visible: false }));
      if (redirect) navigate(redirect);
    }, duration);
  };

  const handleSaveDraft = async () => {
    const payload = preparePayload();
    const result = await postEvent({
      event: payload,
      action: 'new',
      submissionType: 'draft',
    });
    if (result.success) {
      showToast({ message: 'Draft saved successfully', type: 'success', redirect: '/dashboard/events' });
    } else {
      showToast({ message: `Failed to save draft: ${result.error}`, type: 'failure' });
    }
  };

  const handlePublish = async () => {
    const payload = preparePayload();
    const result = await postEvent({
      event: payload,
      action: 'new',
      submissionType: 'publish',
    });
    if (result.success) {
      showToast({ message: 'Event published successfully', type: 'success', redirect: '/dashboard/events' });
    } else {
      showToast({ message: `Failed to publish event: ${result.error}`, type: 'failure' });
    }
  };

  const handleSchedule = async () => {
    const payload = preparePayload();
    payload.StartDate = meta.StartDate || new Date().toISOString();
    payload.EndDate = meta.EndDate || new Date().toISOString();
    const result = await postEvent({
      event: payload,
      action: 'new',
      submissionType: 'schedule',
    });
    if (result.success) {
      showToast({ message: 'Event scheduled successfully', type: 'success', redirect: '/dashboard/events' });
    } else {
      showToast({ message: `Failed to schedule event: ${result.error}`, type: 'failure' });
    }
  };

  return (
    <>
      {toastConfig.visible && (
        <MessageToast
          message={toastConfig.message}
          duration={toastConfig.duration}
          type={toastConfig.type}
          redirect={toastConfig.redirect}
          onClose={() => setToastConfig((prev) => ({ ...prev, visible: false }))}
        />
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <ContentMeta
          meta={meta}
          onChange={handleMetaChange}
          fields={{
            title: true,
            slug: true,
            summary: true,
            status: true,
            image: 'EventImage',
            description: true,
            start: true,
            end: true,
            mode: true,
            location: true,
            eventType: true,
            paymentType: true,
            registrationType: true,
            organizer: true,
            contributor: false,
            repo: false,
            reference: false,
            audio: false,
            episode: false,
            ip: false,
            toolsUsed: false,
            osType: false,
            difficulty: false,
            progress: false,
          }}
        />
        <Uploads
          type="image"
          New={true}
          contentType="events"
          UploadKey={meta.UploadKey}
          onUpload={handleUploadKey}
        />
      </div>
      {/* You can add a tag selector here if needed */}
      <div className="flex gap-4 mt-4">
        <button className="bg-lime-500 text-white px-4 py-2 rounded" onClick={handleSaveDraft}>Save as Draft</button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handlePublish}>Publish</button>
        <button className="bg-yellow-500 text-white px-4 py-2 rounded" onClick={handleSchedule}>Schedule</button>
      </div>
    </>
  );
}
