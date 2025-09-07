import React, { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Link } from 'react-router-dom';
import { postWriteUp, deleteWriteUp } from '../../utils/apiWriteUpRequests';
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

export default function WritupList({ writeups = [], showActions = true, onDelete = () => {} }) {
  const s = style.writeupList;
  //const [writeups, setData] = useState(writeups);
  const [isOpen, setIsOpen] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  const [writeupToDelete, setWriteupToDelete] = useState(null);
  const [error, setError] = useState('');
  const [toastConfig, setToastConfig] = useState({
    message: '',
    duration: 4000,
    redirect: '',
    type: 'success',
    visible: false,
  });

  if (!writeups || writeups.length === 0) {
    return (
      <ErrorHandle
        type="WriteUp"
        errorType="server"
        message="No writeups available."
      />
    );
  }

  const openModal = (item) => {
    setWriteupToDelete(item);
    setDeleteReason('');
    setError('');
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setDeleteReason('');
    setWriteupToDelete(null);
    setError('');
  };

  const handleDelete = async () => {
    if (!deleteReason.trim()) {
      setError('Reason is required to delete a writeup.');
      return;
    }
    try {
      const { success, error: deleteError } = await deleteWriteUp({
        action: 'delete',
        writeup: {
          WriteUpID: writeupToDelete.WriteUpID,
          Reason: deleteReason.trim(),
        },
      });
      if (success) {
        onDelete?.(writeupToDelete.WriteUpID);
        closeModal();
      } else {
        setError(deleteError || 'Failed to delete writeup.');
      }
    } catch {
      setError('An unexpected error occurred.');
    }
  };

  const showMessageToast = (config) => {
    setToastConfig({ ...toastConfig, ...config, visible: true });
  };

  const handlePublishNow = async (item) => {
    const result = await postWriteUp({
      writeupData: item,
      action: 'edit',
      submissionType: 'publish',
    });
    if (result.success) {
      showMessageToast({
        message: 'WriteUp published successfully!',
        duration: 6000,
        redirect: '/dashboard/writeups',
        type: 'success',
      });
      setData((current) =>
        current.map((w) =>
          w.WriteUpID === item.WriteUpID ? { ...w, Status: 'Published' } : w
        )
      );
    } else {
      showMessageToast({
        message: `Failed to publish writeup: ${result.error}`,
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
        {writeups.map((w) => (
          <div key={w.WriteUpID} className={s.item}>
            <div className={s.contentRow}>
              <img
                src={w.WriteUpImage}
                alt={w.Title}
                className={s.thumbnail}
              />
              <div className={s.info}>
                <h3 className={s.title}>{w.MachineName}</h3>
                <p className={s.meta}>
                  Category:{' '}
                  <span className={s.metaValue}>{w.CategoryName}</span> | Author:{' '}
                  <span className={s.metaValue}>{w.Contributors}</span>
                </p>
                <p className={s.summary}>{w.Summary}</p>
                <p className={s.status}>
                  Status:{' '}
                  <span className={s.statusBadge[w.Status] || ''}>
                    {w.Status}
                  </span>
                </p>
                {w.Status === 'Scheduled' && (
                  <>
                    <p className={s.status}>
                      Scheduled for:{' '}
                      <span className={s.metaValue}>
                        {new Date(w.PublishDate).toLocaleString()}
                      </span>
                    </p>
                    <button
                      onClick={() => handlePublishNow(w)}
                      className={s.ScheduledActionBtn}
                    >
                      <FaCloudUploadAlt /> Publish Now
                    </button>
                  </>
                )}
                {w.Status === 'Draft' && (
                  <Link
                    to={`/dashboard/writeups/edit`}
                    state={{ writeup: w }}
                    className={s.DraftScheduledActionBtn}
                  >
                    <FaPenFancy /> Continue Writing
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
                      `/writeups/${w.Slug}`,
                      '_blank',
                      'noopener,noreferrer'
                    )
                  }
                  title="Preview"
                >
                  <FaEye />
                </button>
                <Link
                  to={`/dashboard/writeups/edit`}
                  state={{ writeup: w }}
                  className={s.actionBtn.edit}
                  title="Edit"
                >
                  <FaEdit />
                </Link>
                <button
                  className={s.actionBtn.delete}
                  onClick={() => openModal(w)}
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
                    Confirm WriteUp Deletion
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
                    Please provide a reason for deleting this writeup. This
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
                    Delete WriteUp
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
