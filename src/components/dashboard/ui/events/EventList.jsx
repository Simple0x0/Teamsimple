import React, { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Link } from 'react-router-dom';
import { fetchEvents, postEvent } from '../../utils/apiEventRequest';
import MessageToast from '../MessageToast';
import Search from '../../../public/ui/Search';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import style from '../../../../app/Style';
import Loading from '../../../public/ui/Loading';
import ErrorHandle from '../../../public/ui/ErrorHandle';

export default function EventList({ showActions = true, onDelete = () => {} }) {
  const s = style.projectList;
  const [isOpen, setIsOpen] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  const [eventToDelete, setEventToDelete] = useState(null);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [toastConfig, setToastConfig] = useState({
    message: '',
    duration: 4000,
    redirect: '',
    type: 'success',
    visible: false,
  });
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      try {
        const res = await fetchEvents();
        setEvents(res.Events || []);
      } catch (e) {
        setError('Failed to load events.');
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, []);

  const filteredEvents = events.filter((e) => {
    const term = searchTerm.toLowerCase();
    return (
      e.Title.toLowerCase().includes(term) ||
      (e.Summary && e.Summary.toLowerCase().includes(term)) ||
      (e.Description && e.Description.toLowerCase().includes(term)) ||
      (e.Location && e.Location.toLowerCase().includes(term)) ||
      (e.Mode && e.Mode.toLowerCase().includes(term)) ||
      (e.Status && e.Status.toLowerCase().includes(term)) ||
      (e.ProgressStatus && e.ProgressStatus.toLowerCase().includes(term))
    );
  });

  const EVENTS_PER_PAGE = 6;
  const totalPages = Math.ceil(filteredEvents.length / EVENTS_PER_PAGE);
  const startIndex = (currentPage - 1) * EVENTS_PER_PAGE;
  const endIndex = startIndex + EVENTS_PER_PAGE;
  const eventsToDisplay = filteredEvents.slice(startIndex, endIndex);

  if (loading) return <Loading />;
  if (error) return <ErrorHandle type="Event" errorType="server" message={error} />;
  if (!events || events.length === 0) {
    return <ErrorHandle type="Event" errorType="server" message="No events available." />;
  }

  const openModal = (item) => {
    setEventToDelete(item);
    setDeleteReason('');
    setError('');
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setDeleteReason('');
    setEventToDelete(null);
    setError('');
  };

  const handleDelete = async () => {
    if (!deleteReason.trim()) {
      setError('Reason is required to delete an event.');
      return;
    }
    try {
      const { success, error: deleteError } = await postEvent({
        action: 'delete',
        event: {
          EventID: eventToDelete.EventID,
          Reason: deleteReason.trim(),
        },
      });
      if (success) {
        onDelete?.(eventToDelete.EventID);
        setEvents((prev) => prev.filter((e) => e.EventID !== eventToDelete.EventID));
        closeModal();
        setToastConfig({
          message: 'Event deleted successfully!',
          duration: 4000,
          type: 'success',
          visible: true,
        });
      } else {
        setError(deleteError || 'Failed to delete event.');
      }
    } catch {
      setError('An unexpected error occurred.');
    }
  };

  const showMessageToast = (config) => {
    setToastConfig({ ...toastConfig, ...config, visible: true });
  };

  const handleSearchChange = (term) => {
    setSearchTerm(term.toLowerCase());
    setCurrentPage(1);
  };

  // Registration type change handler (outside JSX)
  async function handleRegistrationTypeChange(e, newType) {
    const prevType = e.RegistrationType;
    setEvents((prev) => prev.map(ev => ev.EventID === e.EventID ? { ...ev, RegistrationType: newType } : ev));
    try {
      const response = await postEvent({
        action: 'edit',
        event: { ...e, RegistrationType: newType },
      });
      showMessageToast({ message: response?.data?.message || 'Registration type updated', type: response?.success ? 'success' : 'failure' });
    } catch (err) {
      showMessageToast({ message: err?.error || 'Failed to update registration type', type: 'failure' });
      setEvents((prev) => prev.map(ev => ev.EventID === e.EventID ? { ...ev, RegistrationType: prevType } : ev));
    }
  }

  const registrationTypeOptions = [
    { value: 'Open', label: 'Open' },
    { value: 'Closed', label: 'Closed' },
  ];

  return (
    <>
      {toastConfig.visible && (
        <MessageToast
          {...toastConfig}
          onClose={() => setToastConfig((prev) => ({ ...prev, visible: false }))}
        />
      )}
      <div className={s.searchBar}>
        <Search
          title="Events"
          placeholder="Search for events..."
          onSearchChange={handleSearchChange}
          filterOptions={[]}
          showFilter={false}
        />
      </div>
      <div className={s.wrapper}>
        {eventsToDisplay.map((e) => (
          <div key={e.EventID} className={s.item}>
            <div className={s.contentRow}>
              <img src={e.EventImage} alt={e.Title} className={s.thumbnail} />
              <div className={s.info}>
                <h3 className={s.title}>{e.Title}</h3>
                <p className={s.meta}>
                  <span className={s.metaValue}>{e.EventType}</span> | {e.Mode} | {e.Location}
                </p>
                <p className={s.meta}>
                  {new Date(e.StartDate).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                  {' '}–{' '}
                  {new Date(e.EndDate).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
                {e.Summary && <p className={s.summary}>{e.Summary}</p>}
                {e.Description && <p className={s.summary}>{e.Description}</p>}
                {/* RegistrationType dropdown */}
                <div className="flex items-center gap-2 my-2">
                  <label className="text-sm font-medium text-gray-400">Registration Type:</label>
                  <select
                    value={e.RegistrationType}
                    onChange={(evt) => handleRegistrationTypeChange(e, evt.target.value)}
                    className="bg-gray-800 text-white px-3 py-1 rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-lime-400 text-sm"
                  >
                    {registrationTypeOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                {/* Status logic: show ENDED in red if EndDate is past */}
                {(() => {
                  const now = new Date();
                  const end = new Date(e.EndDate);
                  if (end < now) {
                    return (
                      <p className={s.status}>
                        Status: <span style={{ color: 'red', fontWeight: 'bold' }}>ENDED</span>
                      </p>
                    );
                  } else {
                    return (
                      <>
                        <p className={s.status}>
                          Status: <span className={s.statusBadge?.[e.Status] || ''}>{e.Status}</span>
                        </p>
                        <p className={s.status}>
                          Progress: <span className={s.statusBadge?.[e.ProgressStatus] || ''}>{e.ProgressStatus}</span>
                        </p>
                      </>
                    );
                  }
                })()}
                {e.Tags && (
                  <p className={s.meta}>
                    Tags: <span className={s.metaValue}>{e.Tags}</span>
                  </p>
                )}
                <p className={s.meta}>
                  Organizer: <span className={s.metaValue}>{e.OrganizerName}</span>
                </p>
              </div>
            </div>
            {showActions && (
              <div className={s.actions}>
                <button
                  className={s.actionBtn.preview}
                  onClick={() => window.open(`/events/${e.EventID}`, '_blank', 'noopener,noreferrer')}
                  title="Preview"
                >
                  <FaEye />
                </button>
                <Link
                  to={`/dashboard/events/edit`}
                  state={{ event: e }}
                  className={s.actionBtn.edit}
                  title="Edit"
                >
                  <FaEdit />
                </Link>
                <button
                  className={s.actionBtn.delete}
                  onClick={() => openModal(e)}
                  title="Delete"
                >
                  <FaTrash />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className={s.pagination}>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={currentPage === i + 1 ? s.activePage : s.pageBtn}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
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
                    Confirm Event Deletion
                  </Dialog.Title>
                  <button onClick={closeModal} className={style.Modal.XButton}>
                    ×
                  </button>
                </div>
                <div>
                  <p className={style.Modal.InfoText}>
                    Please provide a reason for deleting this event. This is required.
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
                    Delete Event
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
