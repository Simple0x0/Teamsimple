import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ContentMeta from '../ContentMeta';
import Uploads from '../Uploads';
import ContentMDEditor from '../ContentMDEditor';
import { postEvent } from '../../utils/apiEventRequest';
import MessageToast from '../MessageToast';
import ErrorHandle from '../../../public/ui/ErrorHandle';
import style from '../../../../app/Style';

export default function EventEdit() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const originalEvent = state?.event;
  const [meta, setMeta] = useState(originalEvent || {});
  const [content, setContent] = useState(originalEvent?.Description || '');
  const [selectedTags, setSelectedTags] = useState(
    (originalEvent?.Tags || '').split(',').map(t => t.trim()).filter(Boolean).map(name => ({ id: name, name }))
  );
  const [selectedCategory, setSelectedCategory] = useState(
    originalEvent?.CategoryID ? { id: originalEvent.CategoryID, name: originalEvent.CategoryName } : null
  );
  const [toastConfig, setToastConfig] = useState({
    message: '',
    duration: 4000,
    redirect: '',
    type: 'success',
    visible: false,
  });

  if (!originalEvent) {
    return <ErrorHandle message="Failed to load Event." errorType="public" path="/dashboard/events" />;
  }

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
  const progressStatusOptions = [
    { value: 'Upcoming', label: 'Upcoming' },
    { value: 'Ongoing', label: 'Ongoing' },
    { value: 'Completed', label: 'Completed' },
    { value: 'Cancelled', label: 'Cancelled' },
  ];

  const showMessageToast = ({ message = '', duration = 4000, redirect = '', type = 'success' }) => {
    setToastConfig({ message, duration, redirect, type, visible: true });
  };

  const handleMetaChange = (updatedMeta) => {
    setMeta(updatedMeta);
  };

  const handleUploadKey = (key) => {
    setMeta(prev => ({ ...prev, UploadKey: key }));
  };

  const preparePayload = () => ({
    ...meta,
    Description: content,
    Tags: selectedTags.map(tag => tag.name || tag),
    CategoryID: selectedCategory?.id,
    CategoryName: selectedCategory?.name,
    ProgressStatus: meta.ProgressStatus,
    Summary: meta.Summary,
    Slug: meta.Slug,
    Status: meta.Status,
  });

  const handleSaveDraft = async () => {
    const payload = preparePayload();
    const result = await postEvent({
      event: payload,
      action: 'edit',
      submissionType: 'draft',
    });
    if (result.success) {
      showMessageToast({ message: result?.data?.message || 'Draft saved successfully', redirect: '/dashboard/events', type: 'success' });
    } else {
      showMessageToast({ message: result?.error || 'Failed to save draft', type: 'failure' });
    }
  };

  const handlePublish = async () => {
    const payload = preparePayload();
    const result = await postEvent({
      event: payload,
      action: 'edit',
      submissionType: 'publish',
    });
    if (result.success) {
      showMessageToast({ message: result?.data?.message || 'Event published successfully', redirect: '/dashboard/events', type: 'success' });
    } else {
      showMessageToast({ message: result?.error || 'Failed to publish event', type: 'failure' });
    }
  };

  const handleSchedule = async () => {
    const payload = preparePayload();
    payload.StartDate = meta.StartDate || new Date().toISOString();
    payload.EndDate = meta.EndDate || new Date().toISOString();
    const result = await postEvent({
      event: payload,
      action: 'edit',
      submissionType: 'schedule',
    });
    if (result.success) {
      showMessageToast({ message: result?.data?.message || 'Event scheduled successfully', redirect: '/dashboard/events', type: 'success' });
    } else {
      showMessageToast({ message: result?.error || 'Failed to schedule event', type: 'failure' });
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
          mode="edit"
          fields={{
            title: true,
            slug: true,
            summary: true,
            ProgressStatus: true,
            status: true,
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
          progressStatusinput={progressStatusOptions}
          statusinput={statusOptions}
        />
        <Uploads
          type="image"
          New={false}
          contentType="events"
          UploadKey={meta.UploadKey}
          onUpload={handleUploadKey}
        />
      </div>
      <ContentMDEditor
        contentType="Event"
        mode="edit"
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
