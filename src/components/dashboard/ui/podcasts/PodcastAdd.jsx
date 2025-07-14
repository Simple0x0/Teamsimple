import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ContentMDEditor from '../ContentMDEditor';
import ContentMeta from '../ContentMeta';
import Uploads from '../Uploads';
import { postPodcast } from '../../utils/apiPodcastRequests';
import MessageToast from '../MessageToast';

export default function PodcastAdd() {
  const navigate = useNavigate();
  const [meta, setMeta] = useState({ ContentType: 'Podcast' });
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

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
    Content: content,
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
    const result = await postPodcast({
      podcastData: payload,
      action: 'new',
      submissionType: 'draft',
    });
    if (result.success) {
      showToast({ message: 'Draft saved successfully', redirect: '/dashboard/podcasts' });
    } else {
      showToast({ message: `Failed to save draft: ${result.error}`, type: 'failure' });
    }
  };

  const handlePublish = async () => {
    const payload = preparePayload();
    const result = await postPodcast({
      podcastData: payload,
      action: 'new',
      submissionType: 'publish',
    });
    if (result.success) {
      showToast({ message: 'Podcast published successfully', redirect: '/dashboard/podcasts' });
    } else {
      showToast({ message: `Failed to publish podcast: ${result.error}`, type: 'failure' });
    }
  };

  const handleSchedule = async () => {
    const payload = preparePayload();
    payload.DatePublished = meta.DatePublished || new Date().toISOString();
    const result = await postPodcast({
      podcastData: payload,
      action: 'new',
      submissionType: 'schedule',
    });
    if (result.success) {
      showToast({ message: 'Podcast scheduled successfully', redirect: '/dashboard/podcasts' });
    } else {
      showToast({ message: `Failed to schedule podcast: ${result.error}`, type: 'failure' });
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
          contentType="Podcast"
          meta={meta}
          onChange={handleMetaChange}
          mode="new"
          fields={{
            slug: true,
            image: 'CoverImage',
            contributor: true,
            description: true,
            DatePublished: true,
            Duration: true,
            EpisodeNumber: true,
            AudioURL: true,
          }}
          statusinput={[
            { value: 'Draft', label: 'Draft' },
            { value: 'Scheduled', label: 'Scheduled' },
            { value: 'Published', label: 'Published' },
          ]}
        />

        <div className='grid gap-3'>
          <Uploads
            meta={meta}
            type="image"
            New={true}
            contentType="podcasts"
            UploadKey={meta.UploadKey}
            onUpload={handleUploadKey}
          />

          {meta.UploadKey && (
            <Uploads
            meta={meta}
            type="audio"
            New={true}
            contentType="podcasts"
            UploadKey={meta.UploadKey}
            onUpload={handleUploadKey}
          />
          )}
        </div>
      </div>

      <ContentMDEditor
        contentType="Podcast"
        mode="new"
        initialContent={meta.Content || ''}
        initialTags={(meta.Tags || '')
          .split(',')
          .map((t) => t.trim())
          .filter((t) => t.length > 0)
          .map((name) => ({ id: name, name }))}
        initialCategory={{ id: meta.CategoryID, name: meta.CategoryName }}
        actions={['draft', 'publish', 'schedule']}
        showTechStacks={false}
        onContentChange={setContent}
        onTagsChange={setSelectedTags}
        onCategoriesChange={setSelectedCategory}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
        onSchedule={handleSchedule}
      />
    </>
  );
}
