import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ContentMDEditor from '../ContentMDEditor';
import ContentMeta from '../ContentMeta';
import Uploads from '../Uploads';
import { postBlog } from '../../utils/apiBlogRequests';
import MessageToast from '../MessageToast';

export default function BlogAdd() {
  const navigate = useNavigate();
  const [meta, setMeta] = useState({});
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedCategory, setselectedCategory] = useState(null);

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
    setMeta(prev => ({ ...prev, UploadKey: key }));
  };

  const preparePayload = () => ({
    ...meta,
    Content: content,
    Tags: selectedTags.map(tag => tag.name || tag),
    CategoryID: selectedCategory?.id,
    CategoryName: selectedCategory?.name,
  });

  const showToast = ({ message, duration = 6000, type = 'success', redirect = '' }) => {
    setToastConfig({ message, duration, type, redirect, visible: true });
    setTimeout(() => {
      setToastConfig(prev => ({ ...prev, visible: false }));
      if (redirect) navigate(redirect);
    }, duration);
  };

  const handleSaveDraft = async () => {
    const payload = preparePayload();
    const result = await postBlog({
      blogData: payload,
      action: 'new',
      submissionType: 'draft',
    });
    if (result.success) {
      showToast({ message: 'Draft saved successfully', type: 'success', redirect: '/dashboard/blogs' });
    } else {
      showToast({ message: `Failed to save draft: ${result.error}`, type: 'failure' });
    }
  };

  const handlePublish = async () => {
    const payload = preparePayload();
    const result = await postBlog({
      blogData: payload,
      action: 'new',
      submissionType: 'publish',
    });
    if (result.success) {
      showToast({ message: 'Blog published successfully', type: 'success', redirect: '/dashboard/blogs' });
    } else {
      showToast({ message: `Failed to publish blog: ${result.error}`, type: 'failure' });
    }
  };

  const handleSchedule = async () => {
    const payload = preparePayload();
    payload.PublishDate = meta.PublishDate || new Date().toISOString();
    const result = await postBlog({
      blogData: payload,
      action: 'new',
      submissionType: 'schedule',
    });
    if (result.success) {
      showToast({ message: 'Blog scheduled successfully', type: 'success', redirect: '/dashboard/blogs' });
    } else {
      showToast({ message: `Failed to schedule blog: ${result.error}`, type: 'failure' });
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
          onClose={() => setToastConfig(prev => ({ ...prev, visible: false }))}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <ContentMeta
          meta={meta}
          onChange={handleMetaChange}
          fields={{
            slug: true,
            summary: true,
            status: true,
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
          New={true}
          contentType="blogs"
          UploadKey={meta.UploadKey}
          onUpload={handleUploadKey}
        />
      </div>

      <ContentMDEditor
        contentType="Blog"
        initialContent={meta.Content || ''}
        initialTags={(meta.Tags || '')
          .split(',')
          .map(t => t.trim())
          .filter(t => t.length > 0)
          .map(name => ({ id: name, name }))}
        initialCategory={{ id: meta.CategoryID, name: meta.CategoryName }}
        actions={['draft', 'publish', 'schedule']}
        showTechStacks={true}
        showCategories={true}
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
