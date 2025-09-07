import { useEffect, useState } from 'react';
import ContentMDEditor from '../ContentMDEditor';
import ContentMeta from '../ContentMeta';
import MessageToast from '../MessageToast';
import { fetchAboutTeamContent, updateAboutTeamContent } from '../../utils/apiAboutTeam';

export default function AboutTeam() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
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

  const fetchInitialData = async () => {
    const resp = await fetchAboutTeamContent('AboutUs');
    const res = resp.data;
    if (res?.AboutTeam) {
      setTitle(res.AboutTeam.Title || '');
      setDescription(res.AboutTeam.Description || '');
    } else {
      showMessageToast({ message: 'Failed to load About Team', type: 'failure' });
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleSave = async () => {
    const res = await updateAboutTeamContent({
      title: title,
      description: description,
      section: 'AboutUs',
    });
    if (res?.success) {
      showMessageToast({
        message: 'About Team content saved successfully.',
        duration: 4000,
        type: 'success',
      });
    } else {
      showMessageToast({
        message: 'Failed to save About Team content.',
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
        <ContentMeta
          meta={{ Title: title }}
          onChange={({ Title }) => setTitle(Title)}
          mode="edit"
          fields={{ 
            title: true,
            aboutus: true
           }}
        />
      </div>

      <ContentMDEditor
        contentType="About Team"
        mode="edit"
        initialContent={description}
        onContentChange={setDescription}
        onPublish={handleSave}
        actions={['publish']}
        showTechStacks={false}
        showCategories={false}
      />
    </>
  );
}
