import React, { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Link } from 'react-router-dom';
import { postPodcast, deletePodcast } from '../../utils/apiPodcastRequests';
import MessageToast from '../MessageToast';
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaCloudUploadAlt,
  FaPenFancy,
} from 'react-icons/fa';
import style from '../../../../app/Style';
import ErrorHandle from '../../../public/ui/ErrorHandle';

export default function PodcastList({ podcasts = [], showActions = true, onDelete = () => {} }) {
  const s = style.projectList; // Reuse style.projectList or create style.podcastList if needed
  const [isOpen, setIsOpen] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  const [podcastToDelete, setPodcastToDelete] = useState(null);
  const [error, setError] = useState('');
  const [toastConfig, setToastConfig] = useState({
    message: '',
    duration: 4000,
    redirect: '',
    type: 'success',
    visible: false,
  });

  if (!podcasts || podcasts.length === 0) {
    return (
      <ErrorHandle
        type="Podcast"
        errorType="server"
        message="No podcasts available."
      />
    );
  }

  const openModal = (item) => {
    setPodcastToDelete(item);
    setDeleteReason('');
    setError('');
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setDeleteReason('');
    setPodcastToDelete(null);
    setError('');
  };

  const handleDelete = async () => {
    if (!deleteReason.trim()) {
      setError('Reason is required to delete a podcast.');
      return;
    }
    try {
      const { success, error: deleteError } = await deletePodcast({
        action: 'delete',
        podcast: {
          PodcastID: podcastToDelete.PodcastID,
          Reason: deleteReason.trim(),
        },
      });
      if (success) {
        onDelete?.(podcastToDelete.PodcastID);
        closeModal();
      } else {
        setError(deleteError || 'Failed to delete podcast.');
      }
    } catch {
      setError('An unexpected error occurred.');
    }
  };

  const showMessageToast = (config) => {
    setToastConfig({ ...toastConfig, ...config, visible: true });
  };

  const handlePublishNow = async (item) => {
    const result = await postPodcast({
      podcastData: item,
      action: 'edit',
      submissionType: 'publish',
    });
    if (result.success) {
      showMessageToast({
        message: 'Podcast published successfully!',
        duration: 6000,
        redirect: '/dashboard/podcasts',
        type: 'success',
      });
    } else {
      showMessageToast({
        message: `Failed to publish podcast: ${result.error}`,
        duration: 6000,
        type: 'failure',
      });
    }
  };

  return (
    <>
      {toastConfig.visible && (
        <MessageToast
          {...toastConfig}
          onClose={() =>
            setToastConfig((prev) => ({ ...prev, visible: false }))
          }
        />
      )}

      <div className={s.wrapper}>
        {podcasts.map((p) => (
          <div key={p.PodcastID} className={s.item}>
            <div className={s.contentRow}>
              <img src={p.CoverImage} alt={p.Title} className={s.thumbnail} />
              <div className={s.info}>
                <h3 className={s.title}>Episode {p.EpisodeNumber}: {p.Title}</h3>
                <p className={s.meta}>
                  Category: <span className={s.metaValue}>{p.CategoryName}</span> | Duration:{' '}
                  <span className={s.metaValue}>{p.Duration} min</span> 
                </p>
                <p className={s.summary}>{p.Description}</p>
                <p className={s.status}>
                  Status:{' '}
                  <span className={s.statusBadge[p.Status] || ''}>
                    {p.Status}
                  </span>
                </p>
                {p.Status === 'Scheduled' && (
                  <>
                    <p className={s.status}>
                      Scheduled for:{' '}
                      <span className={s.metaValue}>
                        {new Date(p.DatePublished).toLocaleString()}
                      </span>
                    </p>
                    <button
                      onClick={() => handlePublishNow(p)}
                      className={s.ScheduledActionBtn}
                    >
                      <FaCloudUploadAlt /> Publish Now
                    </button>
                  </>
                )}
                {p.Status === 'Draft' && (
                  <Link
                    to={`/dashboard/podcasts/edit`}
                    state={{ podcast: p }}
                    className={s.DraftScheduledActionBtn}
                  >
                    <FaPenFancy /> Continue Editing
                  </Link>
                )}
              </div>
            </div>

            {showActions && (
              <div className={s.actions}>
                <button
                  className={s.actionBtn.preview}
                  onClick={() =>
                    window.open(
                      `/podcasts/${p.Slug}`,
                      '_blank',
                      'noopener,noreferrer'
                    )
                  }
                  title="Preview"
                >
                  <FaEye />
                </button>
                <Link
                  to={`/dashboard/podcasts/edit`}
                  state={{ podcast: p }}
                  className={s.actionBtn.edit}
                  title="Edit"
                >
                  <FaEdit />
                </Link>
                <button
                  className={s.actionBtn.delete}
                  onClick={() => openModal(p)}
                  title="Delete"
                >
                  <FaTrash />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className={style.Modal.Dialog} onClose={closeModal}>
          <Transition.Child as={Fragment} {...transitionProps}>
            <div className={style.Modal.BGDim} />
          </Transition.Child>

          <div className={style.Modal.ContentContainer}>
            <Transition.Child as={Fragment} {...transitionProps}>
              <Dialog.Panel className={style.Modal.SmallDialogPanel}>
                <div className={style.Modal.HeaderContainer}>
                  <Dialog.Title className={style.Modal.Title}>
                    Confirm Podcast Deletion
                  </Dialog.Title>
                  <button onClick={closeModal} className={style.Modal.XButton}>
                    ×
                  </button>
                </div>
                <div>
                  <p className={style.Modal.InfoText}>
                    Please provide a reason for deleting this podcast. This is required.
                  </p>
                  <textarea
                    value={deleteReason}
                    onChange={(e) => setDeleteReason(e.target.value)}
                    rows={4}
                    className={style.Modal.ReasonInput}
                    placeholder="Enter reason here..."
                    required
                  />
                  {error && <p className={style.Modal.ErrorText}>{error}</p>}
                </div>
                <div className={style.Modal.ButtonRow}>
                  <button
                    type="button"
                    onClick={closeModal}
                    className={style.Modal.CancelButton}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className={style.Modal.DeleteButton}
                  >
                    Delete Podcast
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

const transitionProps = {
  enter: style.Modal.Enter,
  enterFrom: style.Modal.EnterScaleFrom,
  enterTo: style.Modal.EnterScaleTo,
  leave: style.Modal.Leave,
  leaveFrom: style.Modal.LeaveScaleFrom,
  leaveTo: style.Modal.LeaveScaleTo,
};
