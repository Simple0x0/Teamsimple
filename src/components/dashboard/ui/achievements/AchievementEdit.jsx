import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import ContentMDEditor from '../ContentMDEditor';
import ContentMeta from '../ContentMeta';
import ErrorHandle from '../../../public/ui/ErrorHandle';
import Uploads from '../Uploads';
import { postAchievement } from '../../utils/apiAchievementRequests';
import MessageToast from '../MessageToast';

export default function AchievementEdit() {
  const { state } = useLocation();

  const originalAchievement = state?.achievement;
  const [meta, setMeta] = useState(originalAchievement || {});
  const [content, setContent] = useState(originalAchievement?.Content || '');
  const [toastConfig, setToastConfig] = useState({
    message: '',
    duration: 4000,
    redirect: '',
    type: 'success',
    visible: false,
  });

  if (!originalAchievement) {
    return <ErrorHandle message="Failed to load Achievement Management." errorType="public" path="/dashboard/achievements" />;
  }

  const showMessageToast = (config) => {
    setToastConfig({ ...toastConfig, ...config, visible: true });
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
  });

  const handleSaveDraft = async () => {
    const payload = preparePayload();
    const result = await postAchievement({
      achievementData: payload,
      action: meta?.AchievementID ? 'edit' : 'new',
      submissionType: 'draft',
    });

    if (result.success) {
      showMessageToast({
        message: 'Draft saved successfully!',
        duration: 4000,
        redirect: '/dashboard/achievements',
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
    const result = await postAchievement({
      achievementData: payload,
      action: meta?.AchievementID ? 'edit' : 'new',
      submissionType: 'publish',
    });

    if (result.success) {
      showMessageToast({
        message: 'Achievement published successfully!',
        duration: 6000,
        redirect: '/dashboard/achievements',
        type: 'success',
      });
    } else {
      showMessageToast({
        message: `Failed to publish achievement: ${result.error}`,
        duration: 6000,
        type: 'failure',
      });
    }
  };

  const handleSchedule = async () => {
    const payload = preparePayload();
    payload.DateAchieved = meta.DateAchieved || new Date().toISOString();

    const result = await postAchievement({
      achievementData: payload,
      action: meta?.AchievementID ? 'edit' : 'new',
      submissionType: 'schedule',
    });

    if (result.success) {
      showMessageToast({
        message: 'Achievement scheduled successfully!',
        duration: 6000,
        redirect: '/dashboard/achievements',
        type: 'success',
      });
    } else {
      showMessageToast({
        message: `Failed to schedule achievement: ${result.error}`,
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
            slug: false,
            summary: true,
            status: false,
            image: 'Image',
            contributor: false,
            description: true,
            BoxCreator: false,
            releaseDate: true,
            platform: false,
            repo: false,
            reference: true,
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
          contentType="achievements"
          UploadKey={meta.UploadKey}
          onUpload={handleUploadKey}
        />
      </div>

      <ContentMDEditor
        contentType="Achievement"
        mode="edit"
        initialContent={meta.Content}
        actions={['publish']}
        showTechStacks={false}
        onContentChange={setContent}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
        onSchedule={handleSchedule}
      />
    </>
  );
}
