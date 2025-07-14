import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import ContentMDEditor from '../ContentMDEditor';
import ContentMeta from '../ContentMeta';
import ErrorHandle from '../../../public/ui/ErrorHandle';
import Uploads from '../Uploads';
import { postBlog } from '../../utils/apiBlogRequests';
import MessageToast from '../MessageToast';

export default function BlogEdit() {
  const { state } = useLocation();

  const originalBlog = state?.blog;
  const [meta, setMeta] = useState(originalBlog || {});
  const [content, setContent] = useState(originalBlog?.Content || '');
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedCategory, setselectedCategory] = useState(null);

  // Toast config now includes all fields needed
  const [toastConfig, setToastConfig] = useState({
    message: '',
    duration: 4000,
    redirect: '',
    type: 'success',
    visible: false,
  });

  if (!originalBlog) {
    return <ErrorHandle message="Failed to load Blog Management." errorType="public" path="/dashboard/blogs" />;
  }

  // Accept an object so you can set message, duration, redirect, and type
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
    const result = await postBlog({
      blogData: payload,
      action: meta?.BlogID ? 'edit' : 'new',
      submissionType: 'draft',
    });
    
    if (result.success) {
      showMessageToast({
        message: 'Draft saved successfully!',
        duration: 4000,
        redirect: '/dashboard/blogs',
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
    const result = await postBlog({
      blogData: payload,
      action: meta?.BlogID ? 'edit' : 'new',
      submissionType: 'publish',
    });
    
    if (result.success) {
      showMessageToast({
        message: 'Blog published successfully!',
        duration: 6000,
        redirect: '/dashboard/blogs',
        type: 'success',
      });
      console.log(result);
    } else {
      console.log(result.success);
      showMessageToast({
        message: `Failed to publish blog: ${result.error}`,
        duration: 6000,
        type: 'failure',
      });
    }
  };

  const handleSchedule = async () => {
    const payload = preparePayload();
    payload.PublishDate = meta.PublishDate || new Date().toISOString();

    const result = await postBlog({
      blogData: payload,
      action: meta?.BlogID ? 'edit' : 'new',
      submissionType: 'schedule',
    });

    if (result.success) {
      showMessageToast({
        message: 'Blog scheduled successfully!',
        duration: 6000,
        redirect: '/dashboard/blogs',
        type: 'success',
      });
    } else {
      showMessageToast({
        message: `Failed to schedule blog: ${result.error}`,
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
          ContentType='Blog'
          meta={meta}
          onChange={handleMetaChange}
          mode="edit" // edit or new
          fields={{
            slug: true,
            summary: true,
            status: false,
            image: 'BlogImage',
            contributor: true,
            description: false,
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
          contentType="blogs"
          UploadKey={meta.UploadKey}
          onUpload={handleUploadKey}
        />
      </div>

      <ContentMDEditor
        contentType="Blog"
        mode="edit" // edit or new
        initialContent={meta.Content}
        initialTags={(meta.Tags || '')
          .split(',')
          .map(t => t.trim())
          .filter(t => t.length > 0)
          .map(name => ({ id: name, name }))}
        initialCategory={{ id: meta.CategoryID, name: meta.CategoryName }}
        actions={['publish']}
        showTechStacks={true}
        onContentChange={setContent}
        onTagsChange={setSelectedTags}
        onCategoriesChange={setselectedCategory}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
        onSchedule={handleSchedule}
      />
    </>
  );
}
