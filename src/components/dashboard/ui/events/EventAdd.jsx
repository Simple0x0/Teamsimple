import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ContentMeta from '../ContentMeta';
import Uploads from '../Uploads';
import ContentMDEditor from '../ContentMDEditor';
import { postEvent } from '../../utils/apiEventRequest';
import MessageToast from '../MessageToast';
import style from '../../../../app/Style';

export default function EventAdd() {
  const navigate = useNavigate();
  const [meta, setMeta] = useState({});
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null); // For future extensibility
  const [toastConfig, setToastConfig] = useState({
    message: '',
    duration: 3000,
    visible: false,
    type: 'success',
    redirect: '',
  });

  // ENUM/select options from DB schema
  const modeOptions = [
    { value: 'Online', label: 'Online' },
    { value: 'In-person', label: 'In-person' },
    { value: 'Hybrid', label: 'Hybrid' },
  ];
  const eventTypeOptions = [
    { value: 'Conference', label: 'Conference' },
    { value: 'Meetup', label: 'Meetup' },
    { value: 'Webinar', label: 'Webinar' },
    { value: 'Workshop', label: 'Workshop' },
    { value: 'Seminar', label: 'Seminar' },
    { value: 'Lecture', label: 'Lecture' },
    { value: 'Panel Discussion', label: 'Panel Discussion' },
    { value: 'Networking Event', label: 'Networking Event' },
    { value: 'Product Launch', label: 'Product Launch' },
    { value: 'Hackathon', label: 'Hackathon' },
  ];
  const statusOptions = [
    { value: 'Draft', label: 'Draft' },
    { value: 'Scheduled', label: 'Scheduled' },
    { value: 'Live', label: 'Live' },
    { value: 'Completed', label: 'Completed' },
    { value: 'Paused', label: 'Paused' },
    { value: 'Cancelled', label: 'Cancelled' },
    { value: 'Deleted', label: 'Deleted' },
  ];
  const registrationTypeOptions = [
    { value: 'Open', label: 'Open' },
    { value: 'Closed', label: 'Closed' },
  ];
  const paymentTypeOptions = [
    { value: 'Free', label: 'Free' },
    { value: 'Paid', label: 'Paid' },
  ];

  const handleMetaChange = (updatedMeta) => {
    setMeta(updatedMeta);
  };

  const handleUploadKey = (key) => {
    setMeta((prev) => ({ ...prev, UploadKey: key }));
  };

  const preparePayload = () => ({
    ...meta,
    Description: content,
    Tags: selectedTags.map((tag) => tag.name || tag),
    CategoryID: selectedCategory?.id,
    CategoryName: selectedCategory?.name,
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
          contentType="Event"
          meta={meta}
          onChange={handleMetaChange}
          mode="new"
          fields={{
            title: true,
            slug: true,
            image: 'EventImage',
            start: true,
            end: true,
            mode: true,
            location: true,
            eventType: true,
            registrationType: true,
            paymentType: true,
            organizer: true,
          }}
          modeinput={modeOptions}
          eventTypeinput={eventTypeOptions}
          registrationTypeinput={registrationTypeOptions}
          paymentTypeinput={paymentTypeOptions}
        />
        <Uploads
          type="image"
          New={true}
          contentType="events"
          UploadKey={meta.UploadKey}
          onUpload={handleUploadKey}
        />
      </div>
      <ContentMDEditor
        contentType="Event"
        mode="new"
        initialContent={content}
        initialTags={selectedTags}
        onContentChange={setContent}
        onTagsChange={setSelectedTags}
        actions={['draft', 'publish', 'schedule']}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
        onSchedule={handleSchedule}
        showTechStacks={true}
        showCategories={false}
      />
    </>
  );
}
