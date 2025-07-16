import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import ContentMeta from '../ContentMeta';
import ErrorHandle from '../../../public/ui/ErrorHandle';
import Uploads from '../Uploads';
import { postContributor } from '../../utils/apiContributorRequests';
import MessageToast from '../MessageToast';

export default function ContributorEdit() {
  const { state } = useLocation();
  const originalContributor = state?.contributor;

  const [meta, setMeta] = useState(originalContributor || {});
  const [toastConfig, setToastConfig] = useState({
    message: '',
    duration: 4000,
    redirect: '',
    type: 'success',
    visible: false,
  });

  if (!originalContributor) {
    return <ErrorHandle message="Failed to load Contributor profile." errorType="public" path="/dashboard/contributors" />;
  }

  const showMessageToast = ({ message = '', duration = 4000, redirect = '', type = 'success' }) => {
    setToastConfig({ message, duration, redirect, type, visible: true });
  };

  const handleMetaChange = (updatedMeta) => {
    setMeta(updatedMeta);
  };

  const handleUploadKey = (key) => {
    setMeta(prev => ({ ...prev, UploadKey: key }));
  };

  const handleSave = async () => {
    const payload = { ...meta };

    const result = await postContributor({
      contributorData: payload,
      action: meta?.ContributorID ? 'edit' : 'new',
    });

    if (result.success) {
      showMessageToast({
        message: 'Contributor profile saved successfully!',
        duration: 4000,
        redirect: '/dashboard/contributors',
        type: 'success',
      });
    } else {
      showMessageToast({
        message: `Failed to save profile: ${result.error}`,
        duration: 5000,
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
          ContentType='Contributor'
          meta={meta}
          onChange={handleMetaChange}
          mode="edit"
          fields={{
            slug: false,
            summary: false,
            status: false,
            image: 'ProfilePicture',
          }}
        />

        <Uploads
          type="image"
          contentType="contributors"
          UploadKey={meta.UploadKey}
          onUpload={handleUploadKey}
        />
      </div>

      <div className="w-full flex justify-end">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm font-medium"
          onClick={handleSave}
        >
          Save Changes
        </button>
      </div>
    </>
  );
}
