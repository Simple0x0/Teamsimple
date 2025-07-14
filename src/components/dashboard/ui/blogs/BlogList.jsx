import React, { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Link } from 'react-router-dom';
import { postBlog, BlogDelete } from '../../utils/apiBlogRequests';
import MessageToast from '../MessageToast';
import { FaEye, FaEdit, FaTrash, FaCloudUploadAlt, FaPenFancy } from 'react-icons/fa';
import style from '../../../../app/Style';
import ErrorHandle from '../../../public/ui/ErrorHandle';

export default function BlogList({ blogs = [], showActions = true, onDelete = () => {} }) {
  const s = style.blogList;
  //const [blog, setBlog] = useState(blogs);
  const [isOpen, setIsOpen] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [error, setError] = useState('');
  const [toastConfig, setToastConfig] = useState({
      message: '',
      duration: 4000,
      redirect: '',
      type: 'success',
      visible: false,
  });  

  if (!blogs || blogs.length === 0) {
    return <ErrorHandle type="Blog" errorType="server" message='No blogs available.'/>;
  }
  
  const openModal = (b) => {
    setBlogToDelete(b);
    setDeleteReason('');
    setError('');
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setDeleteReason('');
    setBlogToDelete(null);
    setError('');
  };

  const handleDelete = async () => {
    if (!deleteReason.trim()) {
      setError('Reason is required to delete a blog.');
      return;
    }

    try {
      const { success, error: deleteError } = await BlogDelete({
        action: 'delete',
        blog: {
          BlogID: blogToDelete.BlogID,
          Reason: deleteReason.trim(),
        },
      });

      if (success) {
        onDelete?.(blogToDelete.BlogID);
        closeModal();
      } else {
        setError(deleteError || 'Failed to delete blog.');
      }
    } catch {
      setError('An unexpected error occurred.');
    }
  };
  const showMessageToast = ({
    message = '',
    duration = 4000,
    redirect = '',
    type = 'success',
  }) => {
    setToastConfig({
      message,
      duration,
      redirect,
      type,
      visible: true,
    });
  };
  const handlePublishNow = async (blg) => {
      const result = await postBlog({
        blogData: blg ? blg : {},
        action: 'edit',
        submissionType: 'publish',
      });
      
      if (result.success) {
        showMessageToast({
          message: 'Blog published successfully!',
          duration: 6000,
          redirect: '/dashboard/blogs',
          type: 'success',
        });
        setBlog((currentblog) =>
          currentblog.map((item) =>
            item.BlogID === blg.BlogID ? { ...item, Status: 'Published' } : item
          )
        );
      } else {
        console.log(result.success);
        showMessageToast({
          message: `Failed to publish blog: ${result.error}`,
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
          onClose={() => setToastConfig(prev => ({ ...prev, visible: false }))}
        />
      )}    
      <div className={s.wrapper}>
        {blogs.map((b) => (
          <div key={b.BlogID} className={s.item}>
            {/* Blog Thumbnail and Info */}
            <div className={s.left}>
              <img src={b.BlogImage} alt={b.Title} className={s.thumbnail} />
              <div className={s.info}>
                <h3 className={s.title}>{b.Title}</h3>
                <p className={s.meta}>
                  Category: <span className={s.metaValue}>{b.CategoryName}</span> &nbsp;|&nbsp;
                  Likes: <span className={s.metaValue}>{b.TotalLikes}</span> &nbsp;|&nbsp;
                  Contributor: <span className={s.metaValue}>{b.Contributors}</span>
                </p>
                <p className={s.summary}>{b.Summary}</p>
                <p className="mt-2 text-sm text-gray-400">
                  Status:{" "}
                  <span
                    className={`font-semibold ${
                      b.Status === "Published"
                        ? "text-lime-500"
                        : b.Status === "Scheduled"
                        ? "text-yellow-400"
                        : "text-orange-400"
                    }`}
                  >
                    {b.Status}
                  </span>
                </p>

                {b.Status === "Scheduled" && (
                  <>
                    <p className="text-xs text-gray-500">
                      Scheduled for:{" "}
                      <span className="text-white font-medium">
                        {new Date(b.PublishDate).toLocaleString()}
                      </span>
                    </p>
                    <button
                      onClick={() => handlePublishNow(b)}
                      className={s.ScheduledActionBtn}>
                      <FaCloudUploadAlt /> Publish Now
                    </button>
                  </>
                )}

                {b.Status === "Draft" && (
                  <Link
                    to={`/dashboard/blogs/edit`}
                    state={{ blog: b }}
                    className={s.DraftScheduledActionBtn}>
                    <FaPenFancy /> Continue Writing
                  </Link>
                )}
              </div>
            </div>

            {showActions && (
              <div className={s.actions}>
                <button
                  className={s.actionBtn.preview}
                  onClick={() => window.open(`/blogs/${b.Slug}`, '_blank', 'noopener,noreferrer')}
                  title="Preview"
                >
                  <FaEye />
                </button>
                <Link
                  to={`/dashboard/blogs/edit`}
                  state={{ blog: b }}
                  className={s.actionBtn.edit}
                  title="Edit"
                >
                  <FaEdit />
                </Link>
                <button
                  className={s.actionBtn.delete}
                  onClick={() => openModal(b)}
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
          <Transition.Child
            as={Fragment}
            enter={style.Modal.Enter}
            enterFrom={style.Modal.EnterFrom}
            enterTo={style.Modal.EnterTo}
            leave={style.Modal.Leave}
            leaveFrom={style.Modal.LeaveFrom}
            leaveTo={style.Modal.LeaveTo}
          >
            <div className={style.Modal.BGDim} />
          </Transition.Child>

          <div className={style.Modal.ContentContainer}>
            <Transition.Child
              as={Fragment}
              enter={style.Modal.Enter}
              enterFrom={style.Modal.EnterScaleFrom}
              enterTo={style.Modal.EnterScaleTo}
              leave={style.Modal.Leave}
              leaveFrom={style.Modal.LeaveScaleFrom}
              leaveTo={style.Modal.LeaveScaleTo}
            >
              <Dialog.Panel className={style.Modal.SmallDialogPanel}>
                <div className={style.Modal.HeaderContainer}>
                  <Dialog.Title className={style.Modal.Title}>
                    Confirm Blog Deletion
                  </Dialog.Title>
                  <button onClick={closeModal} className={style.Modal.XButton}>
                    ×
                  </button>
                </div>

                <div>
                  <p className={style.Modal.InfoText}>
                    Please provide a reason for deleting this blog. This is required.
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
                    Delete Blog
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
