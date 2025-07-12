import React, { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Link } from 'react-router-dom';
import { postProject, deleteProject } from '../../utils/apiProjectRequests';
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

export default function ProjectList({ projects = [], showActions = true, onDelete = () => {} }) {
  const s = style.projectList;
  const [isOpen, setIsOpen] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [error, setError] = useState('');
  const [toastConfig, setToastConfig] = useState({
    message: '',
    duration: 4000,
    redirect: '',
    type: 'success',
    visible: false,
  });

  if (!projects || projects.length === 0) {
    return (
      <ErrorHandle
        type="Project"
        errorType="server"
        message="No projects available."
      />
    );
  }

  const openModal = (item) => {
    setProjectToDelete(item);
    setDeleteReason('');
    setError('');
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setDeleteReason('');
    setProjectToDelete(null);
    setError('');
  };

  const handleDelete = async () => {
    if (!deleteReason.trim()) {
      setError('Reason is required to delete a project.');
      return;
    }
    try {
      const { success, error: deleteError } = await deleteProject({
        action: 'delete',
        project: {
          ProjectID: projectToDelete.ProjectID,
          Reason: deleteReason.trim(),
        },
      });
      if (success) {
        onDelete?.(projectToDelete.ProjectID);
        closeModal();
      } else {
        setError(deleteError || 'Failed to delete project.');
      }
    } catch {
      setError('An unexpected error occurred.');
    }
  };

  const showMessageToast = (config) => {
    setToastConfig({ ...toastConfig, ...config, visible: true });
  };

  const handlePublishNow = async (item) => {
    const result = await postProject({
      projectData: item,
      action: 'edit',
      submissionType: 'publish',
    });
    if (result.success) {
      showMessageToast({
        message: 'Project published successfully!',
        duration: 6000,
        redirect: '/dashboard/projects',
        type: 'success',
      });
      setProjects((current) =>
        current.map((p) =>
          p.ProjectID === item.ProjectID ? { ...p, Status: 'Published' } : p
        )
      );
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
          {...toastConfig}
          onClose={() =>
            setToastConfig((prev) => ({ ...prev, visible: false }))
          }
        />
      )}

      <div className={s.wrapper}>
        {projects.map((p) => (
          <div key={p.ProjectID} className={s.item}>
            <div className={s.contentRow}>
              <img
                src={p.CoverImage}
                alt={p.Title}
                className={s.thumbnail}
              />
              <div className={s.info}>
                <h3 className={s.title}>{p.Title}</h3>
                <p className={s.meta}>
                  Category:{' '}
                  <span className={s.metaValue}>{p.CategoryName}</span> | Contributors:{' '}
                  <span className={s.metaValue}>{p.Contributors}</span> | Completion Level :{' '}
                  <span className={s.metaValue}>{p.ProgressPercentage}%</span>
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
                        {new Date(p.PublishDate).toLocaleString()}
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
                    to={`/dashboard/projects/edit`}
                    state={{ project: p }}
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
                      `/projects/${p.Slug}`,
                      '_blank',
                      'noopener,noreferrer'
                    )
                  }
                  title="Preview"
                >
                  <FaEye />
                </button>
                <Link
                  to={`/dashboard/projects/edit`}
                  state={{ project: p }}
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
                    Confirm Project Deletion
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
                    Please provide a reason for deleting this project. This
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
                    Delete Project
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
