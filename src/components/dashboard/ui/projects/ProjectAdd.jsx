import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ContentMDEditor from '../ContentMDEditor';
import ContentMeta from '../ContentMeta';
import Uploads from '../Uploads';
import { postProject } from '../../utils/apiProjectRequests';
import MessageToast from '../MessageToast';

export default function ProjectAdd() {
  const navigate = useNavigate();
  const [meta, setMeta] = useState({ ContentType: 'Project' });
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
    const result = await postProject({
      projectData: payload,
      action: 'new',
      submissionType: 'draft',
    });
    if (result.success) {
      showToast({ message: 'Draft saved successfully', redirect: '/dashboard/projects' });
    } else {
      showToast({ message: `Failed to save draft: ${result.error}`, type: 'failure' });
    }
  };

  const handlePublish = async () => {
    const payload = preparePayload();
    const result = await postProject({
      projectData: payload,
      action: 'new',
      submissionType: 'publish',
    });
    if (result.success) {
      showToast({ message: 'Project published successfully', redirect: '/dashboard/projects' });
    } else {
      showToast({ message: `Failed to publish project: ${result.error}`, type: 'failure' });
    }
  };

  const handleSchedule = async () => {
    const payload = preparePayload();
    payload.PublishDate = meta.PublishDate || new Date().toISOString();
    const result = await postProject({
      projectData: payload,
      action: 'new',
      submissionType: 'schedule',
    });
    if (result.success) {
      showToast({ message: 'Project scheduled successfully', redirect: '/dashboard/projects' });
    } else {
      showToast({ message: `Failed to schedule project: ${result.error}`, type: 'failure' });
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
          contentType='Project'
          meta={meta}
          onChange={handleMetaChange}
          mode="new"
          fields={{
            slug: true,
            ProgressStatus: true,
            image: 'CoverImage',
            contributor: true,
            description: true,
            repo: true,
            demo: true,
            StartDate: true,
            EndDate: true,
            progress: true,
          }}
          statusinput={[
            { value: 'In Progress', label: 'In Progress' },
            { value: 'Completed', label: 'Completed' },
            { value: 'Paused', label: 'Paused' },
          ]}
        />

        <Uploads
          type="image"
          New={true}
          contentType="projects"
          UploadKey={meta.UploadKey}
          onUpload={handleUploadKey}
        />
      </div>

      <ContentMDEditor
        contentType='Project'
        mode="new"
        initialContent={meta.Content || ''}
        initialTags={(meta.Tags || '')
          .split(',')
          .map(t => t.trim())
          .filter(t => t.length > 0)
          .map(name => ({ id: name, name }))}
        initialCategory={{ id: meta.CategoryID, name: meta.CategoryName }}
        actions={['draft', 'publish', 'schedule']}
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
