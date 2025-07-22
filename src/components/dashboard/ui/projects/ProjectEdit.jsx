import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import ContentMDEditor from '../ContentMDEditor';
import ContentMeta from '../ContentMeta';
import ErrorHandle from '../../../public/ui/ErrorHandle';
import Uploads from '../Uploads';
import { postProject } from '../../utils/apiProjectRequests';
import MessageToast from '../MessageToast';

export default function ProjectEdit() {
  const { state } = useLocation();

  const originalProject = state?.project;
  const [meta, setMeta] = useState(originalProject || {});
  const [content, setContent] = useState(originalProject?.Content || '');
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedCategory, setselectedCategory] = useState(null);
  
  const [toastConfig, setToastConfig] = useState({
    message: '',
    duration: 4000,
    redirect: '',
    type: 'success',
    visible: false,
  });

  if (!originalProject) {
    return <ErrorHandle message="Failed to load Project Management." errorType="public" path="/dashboard/projects" />;
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
    const result = await postProject({
      projectData: payload,
      action: meta?.ProjectID ? 'edit' : 'new',
      submissionType: 'draft',
    });

    if (result.success) {
      showMessageToast({
        message: 'Draft saved successfully!',
        duration: 4000,
        redirect: '/dashboard/projects',
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
    const result = await postProject({
      projectData: payload,
      action: meta?.ProjectID ? 'edit' : 'new',
      submissionType: 'publish',
    });

    if (result.success) {
      showMessageToast({
        message: 'Project published successfully!',
        duration: 6000,
        redirect: '/dashboard/projects',
        type: 'success',
      });
    } else {
      showMessageToast({
        message: `Failed to publish project: ${result.error}`,
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
          contentType="projects"
          UploadKey={meta.UploadKey}
          onUpload={handleUploadKey}
        />
      </div>

      <ContentMDEditor
        contentType="Project"
        mode="edit"
        initialContent={meta.Content}
        initialTags={(meta.Tags || '')
          .split(',')
          .map(t => t.trim())
          .filter(t => t.length > 0)
          .map(name => ({ id: name, name }))}
        initialCategory={{ id: meta.CategoryID, name: meta.CategoryName }}
        actions={['publish']}
        showTechStacks={true}
        showCategories={true}
        onContentChange={setContent}
        onTagsChange={setSelectedTags}
        onCategoriesChange={setselectedCategory}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
      />
    </>
  );
}
