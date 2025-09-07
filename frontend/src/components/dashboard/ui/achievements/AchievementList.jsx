import React, { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Link } from 'react-router-dom';
import { postAchievement, deleteAchievement } from '../../utils/apiAchievementRequests';
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

export default function AchievementList({ achievements = [], showActions = true, onDelete = () => {} }) {
  const s = style.writeupList;
  const [isOpen, setIsOpen] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  const [achievementToDelete, setAchievementToDelete] = useState(null);
  const [error, setError] = useState('');
  const [toastConfig, setToastConfig] = useState({
    message: '',
    duration: 4000,
    redirect: '',
    type: 'success',
    visible: false,
  });

  if (!achievements || achievements.length === 0) {
    return (
      <ErrorHandle
        type="Achievement"
        errorType="server"
        message="No achievements available."
      />
    );
  }

  const openModal = (item) => {
    setAchievementToDelete(item);
    setDeleteReason('');
    setError('');
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setDeleteReason('');
    setAchievementToDelete(null);
    setError('');
  };

  const handleDelete = async () => {
    if (!deleteReason.trim()) {
      setError('Reason is required to delete an achievement.');
      return;
    }
    try {
      const { success, error: deleteError } = await deleteAchievement({
        action: 'delete',
        achievement: {
          AchievementID: achievementToDelete.AchievementID,
          Reason: deleteReason.trim(),
        },
      });
      if (success) {
        onDelete?.(achievementToDelete.AchievementID);
        closeModal();
      } else {
        setError(deleteError || 'Failed to delete achievement.');
      }
    } catch {
      setError('An unexpected error occurred.');
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
        {achievements.map((a) => (
          <div key={a.AchievementID} className={s.item}>
            <div className={s.contentRow}>
              <img
                src={a.Image}
                alt={a.Title}
                className={s.thumbnail}
              />
              <div className={s.info}>
                <h3 className={s.title}>{a.Title}</h3>
                <p className={s.summary}>{a.Description}</p>
                <p className={s.status}>
                  Status:{' '}
                  <span className={s.statusBadge[a.Status] || ''}>{a.Status}</span>
                </p>
                {a.ReferenceURL && (
                  <p className={s.meta}>
                    Reference: <a href={a.ReferenceURL} className={s.metaValue}>{a.ReferenceURL}</a>
                  </p>
                )}
              </div>
            </div>

            {showActions && (
              <div className={s.actions}>
                <button
                  className={s.actionBtn.preview}
                  onClick={() =>
                    window.open(
                      `/achievements/view/${a.AchievementID}`,
                      '_blank',
                      'noopener,noreferrer'
                    )
                  }
                  title="Preview"
                >
                  <FaEye />
                </button>
                <Link
                  to={`/dashboard/achievements/edit`}
                  state={{ achievement: a }}
                  className={s.actionBtn.edit}
                  title="Edit"
                >
                  <FaEdit />
                </Link>
                <button
                  className={s.actionBtn.delete}
                  onClick={() => openModal(a)}
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
        <Dialog
          as="div"
          className={style.Modal.Dialog}
          onClose={closeModal}
        >
          <Transition.Child as={Fragment} {...transitionProps}>
            <div className={style.Modal.BGDim} />
          </Transition.Child>

          <div className={style.Modal.ContentContainer}>
            <Transition.Child as={Fragment} {...transitionProps}>
              <Dialog.Panel className={style.Modal.SmallDialogPanel}>
                <div className={style.Modal.HeaderContainer}>
                  <Dialog.Title className={style.Modal.Title}>
                    Confirm Achievement Deletion
                  </Dialog.Title>
                  <button
                    onClick={closeModal}
                    className={style.Modal.XButton}
                  >
                    ×
                  </button>
                </div>
                <div>
                  <p className={style.Modal.InfoText}>
                    Please provide a reason for deleting this achievement. This
                    is required.
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
                    Delete Achievement
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
