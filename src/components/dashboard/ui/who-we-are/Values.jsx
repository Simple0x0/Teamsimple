
import { useEffect, useState } from 'react';
import ContentMDEditor from '../ContentMDEditor';
import ContentMeta from '../ContentMeta';
import MessageToast from '../MessageToast';
import { fetchAboutTeamContent, updateAboutTeamContent } from '../../utils/apiAboutTeam';

export default function Values() {
  const [meta, setMeta] = useState(null);
  const [content, setContent] = useState('');
  const [toastConfig, setToastConfig] = useState({
    message: '',
    duration: 4000,
    redirect: '',
    type: 'success',
    visible: false,
  });

  const showMessageToast = ({ message, duration, redirect, type }) => {
    setToastConfig({ message, duration, redirect, type, visible: true });
  };

  const handleMetaChange = (updatedMeta) => {
    setMeta(updatedMeta);
  };

  const fetchInitialData = async () => {
    const resp = await fetchAboutTeamContent('Values');
    const res = resp.data;
    if (res?.AboutTeam) {
      setMeta(res.AboutTeam);
      setContent(res.AboutTeam.Description);
    } else {
      showMessageToast({ message: 'Failed to load Values content', type: 'failure' });
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleSave = async () => {
    const payload = {
      ...meta,
      Description: content,
      SectionName: 'Values',
    };

    const res = await updateAboutTeamContent(payload);
    if (res?.status === 'success') {
      showMessageToast({
        message: 'Values content saved successfully.',
        duration: 4000,
        type: 'success',
      });
    } else {
      showMessageToast({
        message: 'Failed to save Values content.',
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

      <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-4">
        {meta && (
          <ContentMeta
            meta={meta}
            onChange={handleMetaChange}
            mode="edit"
            fields={{
              title: true,
              description: false,
              section: true,
            }}
          />
        )}
      </div>

      <ContentMDEditor
        contentType="About Team"
        mode="edit"
        initialContent={content}
        onContentChange={setContent}
        onPublish={handleSave}
        actions={['publish']}
      />
    </>
  );
}
