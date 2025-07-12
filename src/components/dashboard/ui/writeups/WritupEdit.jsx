import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import ContentMDEditor from '../ContentMDEditor';
import ContentMeta from '../ContentMeta';
import ErrorHandle from '../../../public/ui/ErrorHandle';
import Uploads from '../Uploads';
import { postWriteUp } from '../../utils/apiWriteUpRequests';
import MessageToast from '../MessageToast';

export default function WritupEdit() {
  const { state } = useLocation();

  const originalWriteup = state?.writeup;
  const [meta, setMeta] = useState(originalWriteup || {});
  const [content, setContent] = useState(originalWriteup?.Content || '');
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedCategory, setselectedCategory] = useState(null);

  const [toastConfig, setToastConfig] = useState({
    message: '',
    duration: 4000,
    redirect: '',
    type: 'success',
    visible: false,
  });
  
  if (!originalWriteup) {
    return <ErrorHandle message="Failed to load WriteUp Management." errorType="public" path="/dashboard/writeups" />;
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
    setMeta(prev => ({ ...prev, UploadKey: key }));
  };

  const preparePayload = () => ({
    ...meta,
    Content: content,
    Tags: selectedTags.map(tag => tag.name || tag),
    CategoryID: selectedCategory?.id,
    CategoryName: selectedCategory?.name,
  });

  const handleSaveDraft = async () => {
    const payload = preparePayload();
    const result = await postWriteUp({
      writeupData: payload,
      action: meta?.WriteUpID ? 'edit' : 'new',
      submissionType: 'draft',
    });

    if (result.success) {
      showMessageToast({
        message: 'Draft saved successfully!',
        duration: 4000,
        redirect: '/dashboard/writeups',
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
    const result = await postWriteUp({
      writeupData: payload,
      action: meta?.WriteUpID ? 'edit' : 'new',
      submissionType: 'publish',
    });

    if (result.success) {
      showMessageToast({
        message: 'WriteUp published successfully!',
        duration: 6000,
        redirect: '/dashboard/writeups',
        type: 'success',
      });
    } else {
      showMessageToast({
        message: `Failed to publish writeup: ${result.error}`,
        duration: 6000,
        type: 'failure',
      });
    }
  };

  const handleActive = async () => {
      const payload = preparePayload();
      const result = await postWriteUp({
        writeupData: payload,
        action: meta?.WriteUpID ? 'edit' : 'new',
        submissionType: 'active',
      });
      if (result.success) {
        showMessageToast({ message: 'WriteUp published as Active Box', duration: 6000, redirect: '/dashboard/writeups', type: 'success', });
      } else {
        showMessageToast({ message: `Failed to publish writeup: ${result.error}`, duration: 6000, type: 'failure' });
      }
    };

  const handleSchedule = async () => {
    const payload = preparePayload();
    payload.PublishDate = meta.PublishDate || new Date().toISOString();

    const result = await postWriteUp({
      writeupData: payload,
      action: meta?.WriteUpID ? 'edit' : 'new',
      submissionType: 'schedule',
    });

    if (result.success) {
      showMessageToast({
        message: 'WriteUp scheduled successfully!',
        duration: 6000,
        redirect: '/dashboard/writeups',
        type: 'success',
      });
    } else {
      showMessageToast({
        message: `Failed to schedule writeup: ${result.error}`,
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
          onClose={() => setToastConfig(prev => ({ ...prev, visible: false }))}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <ContentMeta
          meta={meta}
          onChange={handleMetaChange}
          mode="edit"
          fields={{
            slug: true,
            summary: true,
            status: false,
            image: 'WriteUpImage',
            contributor: true,
            description: false,
            BoxCreator: true,
            releaseDate: true,
            platform: true,
            repo: false,
            reference: true,
            audio: false,
            episode: false,
            ip: true,
            toolsUsed: true,
            osType: true,
            difficulty: true,
            progress: false,
          }}
        />

        <Uploads
          type="image"
          contentType="writeups"
          UploadKey={meta.UploadKey}
          onUpload={handleUploadKey}
        />
      </div>

      <ContentMDEditor
        contentType="WriteUp"
        mode="edit"
        initialContent={meta.Content}
        initialTags={(meta.Tags || '')
          .split(',')
          .map(t => t.trim())
          .filter(t => t.length > 0)
          .map(name => ({ id: name, name }))}
        initialCategory={{ id: meta.CategoryID, name: meta.CategoryName }}
        actions={['publish', 'active']}
        showTechStacks={true}
        onContentChange={setContent}
        onTagsChange={setSelectedTags}
        onCategoriesChange={setselectedCategory}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
        onSchedule={handleSchedule}
        onActive={handleActive}
      />
    </>
  );
}
