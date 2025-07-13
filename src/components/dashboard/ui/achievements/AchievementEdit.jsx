import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import ContentMeta from '../ContentMeta';
import ErrorHandle from '../../../public/ui/ErrorHandle';
import Uploads from '../Uploads';
import style from '../../../../app/Style';
import { postAchievement } from '../../utils/apiAchievementRequests';
import MessageToast from '../MessageToast';

export default function AchievementEdit() {
  const { state } = useLocation();
  const originalAchievement = state?.achievement;

  const [meta, setMeta] = useState(originalAchievement || {});
  const [toastConfig, setToastConfig] = useState({
    message: '',
    duration: 4000,
    redirect: '',
    type: 'success',
    visible: false,
  });

  if (!originalAchievement) {
    return (
      <ErrorHandle
        message="Failed to load Achievement Management."
        errorType="public"
        path="/dashboard/achievements"
      />
    );
  }

  const showMessageToast = (config) => {
    setToastConfig((prev) => ({ ...prev, ...config, visible: true }));
  };

  const handleMetaChange = (updatedMeta) => {
    setMeta(updatedMeta);
  };

  const handleUploadKey = (key) => {
    setMeta((prev) => ({ ...prev, UploadKey: key }));
  };

  const preparePayload = () => ({
    ...meta,
    Content: meta.Content || '', // fallback
  });

  const handleSaveDraft = async () => {
    const result = await postAchievement({
      achievementData: preparePayload(),
      action: 'edit',
      submissionType: 'draft',
    });

    result.success
      ? showMessageToast({
          message: 'Draft saved successfully!',
          duration: 4000,
          redirect: '/dashboard/achievements',
          type: 'success',
        })
      : showMessageToast({
          message: `Failed to save draft: ${result.error}`,
          duration: 5000,
          type: 'failure',
        });
  };

  const handlePublish = async () => {
    const result = await postAchievement({
      achievementData: preparePayload(),
      action: 'edit',
      submissionType: 'publish',
    });

    result.success
      ? showMessageToast({
          message: 'Achievement published successfully!',
          duration: 6000,
          redirect: '/dashboard/achievements',
          type: 'success',
        })
      : showMessageToast({
          message: `Failed to publish achievement: ${result.error}`,
          duration: 6000,
          type: 'failure',
        });
  };

  const s = style.contentMDEditor;
  return (
    <>
      <h2 className={s.title}> Edit Achievement </h2>
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
          contentType="Achievement"
          meta={meta}
          onChange={handleMetaChange}
          mode="edit"
          fields={{
            slug: false,
            summary: true,
            image: 'Image',
            description: true,
            dateAchieved: true,
            reference: true,
          }}
        />

        <Uploads
          type="image"
          contentType="achievements"
          UploadKey={meta.UploadKey}
          onUpload={handleUploadKey}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-end mt-6">
        <button
          onClick={handleSaveDraft}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          Draft
        </button>
        <button
          onClick={handlePublish}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Publish
        </button>
      </div>
    </>
  );
}
