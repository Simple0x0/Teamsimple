import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ContentMeta from '../ContentMeta';
import Uploads from '../Uploads';
import style from '../../../../app/Style';
import { postAchievement } from '../../utils/apiAchievementRequests';
import MessageToast from '../MessageToast';

export default function AchievementAdd() {
  const navigate = useNavigate();
  const [meta, setMeta] = useState({ ContentType: 'Achievement' });

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
    Content: meta.Content || '', // fallback if needed
  });

  const showToast = ({ message, duration = 6000, type = 'success', redirect = '' }) => {
    setToastConfig({ message, duration, type, redirect, visible: true });
    setTimeout(() => {
      setToastConfig((prev) => ({ ...prev, visible: false }));
      if (redirect) navigate(redirect);
    }, duration);
  };

  const handleSaveDraft = async () => {
    const result = await postAchievement({
      achievementData: preparePayload(),
      action: 'new',
      submissionType: 'draft',
    });

    result.success
      ? showToast({ message: 'Draft saved successfully', redirect: '/dashboard/achievements' })
      : showToast({ message: `Failed to save draft: ${result.error}`, type: 'failure' });
  };

  const handlePublish = async () => {
    const result = await postAchievement({
      achievementData: preparePayload(),
      action: 'new',
      submissionType: 'publish',
    });

    result.success
      ? showToast({ message: 'Achievement published successfully', redirect: '/dashboard/achievements' })
      : showToast({ message: `Failed to publish achievement: ${result.error}`, type: 'failure' });
  };

  const s = style.contentMDEditor;
  return (
    <>
      <h2 className={s.title}> Edit Achievement </h2>
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
          contentType="Achievement"
          meta={meta}
          onChange={handleMetaChange}
          mode="new"
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
          New={true}
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
