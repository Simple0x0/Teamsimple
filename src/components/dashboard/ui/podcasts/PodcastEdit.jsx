import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import ContentMDEditor from '../ContentMDEditor';
import ContentMeta from '../ContentMeta';
import ErrorHandle from '../../../public/ui/ErrorHandle';
import Uploads from '../Uploads';
import { postPodcast } from '../../utils/apiPodcastRequests';
import MessageToast from '../MessageToast';

export default function PodcastEdit() {
  const { state } = useLocation();

  const originalPodcast = state?.podcast;
  const [meta, setMeta] = useState(originalPodcast || {});
  const [content, setContent] = useState(originalPodcast?.Content || '');
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [toastConfig, setToastConfig] = useState({
    message: '',
    duration: 4000,
    redirect: '',
    type: 'success',
    visible: false,
  });

  if (!originalPodcast) {
    return (
      <ErrorHandle
        message="Failed to load Podcast Management."
        errorType="public"
        path="/dashboard/podcasts"
      />
    );
  }

  const showMessageToast = ({
    message = '',
    duration = 4000,
    redirect = '',
    type = 'success',
  }) => {
    setToastConfig({
      message,
      duration,
      redirect,
      type,
      visible: true,
    });
  };

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

  const handleSaveDraft = async () => {
    const payload = preparePayload();
    const result = await postPodcast({
      podcastData: payload,
      action: meta?.PodcastID ? 'edit' : 'new',
      submissionType: 'draft',
    });

    if (result.success) {
      showMessageToast({
        message: 'Draft saved successfully!',
        redirect: '/dashboard/podcasts',
        type: 'success',
      });
    } else {
      showMessageToast({
        message: `Failed to save draft: ${result.error}`,
        duration: 5000,
        type: 'failure',
      });
    }
  };

  const handlePublish = async () => {
    const payload = preparePayload();
    const result = await postPodcast({
      podcastData: payload,
      action: meta?.PodcastID ? 'edit' : 'new',
      submissionType: 'publish',
    });

    if (result.success) {
      showMessageToast({
        message: 'Podcast published successfully!',
        redirect: '/dashboard/podcasts',
        type: 'success',
        duration: 6000,
      });
    } else {
      showMessageToast({
        message: `Failed to publish podcast: ${result.error}`,
        duration: 6000,
        type: 'failure',
      });
    }
  };

  return (
    <>
      {toastConfig.visible && (
        <MessageToast
          message={toastConfig.message}
          duration={toastConfig.duration}
          redirect={toastConfig.redirect}
          type={toastConfig.type}
          onClose={() => setToastConfig((prev) => ({ ...prev, visible: false }))}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <ContentMeta
          meta={meta}
          onChange={handleMetaChange}
          mode="edit"
          fields={{
            slug: true,
            image: 'CoverImage',
            contributor: true,
            description: true,
            DatePublished: true,
            EpisodeNumber: true,
            Duration: true,
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
            type="image"
            New={true}
            contentType="podcasts"
            UploadKey={meta.UploadKey}
            onUpload={handleUploadKey}
          />

          <Uploads
            type="audio"
            New={true}
            contentType="podcasts"
            UploadKey={meta.UploadKey}
            onUpload={handleUploadKey}
          />
        </div>
      </div>

      <ContentMDEditor
        contentType="Podcast"
        mode="edit"
        initialContent={meta.Content}
        initialTags={(meta.Tags || '')
          .split(',')
          .map((t) => t.trim())
          .filter((t) => t.length > 0)
          .map((name) => ({ id: name, name }))}
        initialCategory={{ id: meta.CategoryID, name: meta.CategoryName }}
        actions={['publish']}
        onContentChange={setContent}
        onTagsChange={setSelectedTags}
        onCategoriesChange={setSelectedCategory}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
      />
    </>
  );
}
