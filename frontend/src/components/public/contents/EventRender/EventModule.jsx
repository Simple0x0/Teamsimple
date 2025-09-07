
import React, { useState } from 'react';
import style from '../../../../app/Style';
import { FaCalendarAlt, FaMapMarkerAlt, FaUserTie, FaTags, FaCheckCircle, FaPlayCircle, FaClock } from 'react-icons/fa';
import EventRegistrationModal from '../../modals/EventRegistrationModal';

function getEventStatus(event) {
  const now = new Date();
  const start = new Date(event.StartDate);
  const end = new Date(event.EndDate);
  if (event.ProgressStatus === 'Completed' || end < now) return { label: 'Completed', color: 'bg-gray-700', icon: <FaCheckCircle className="text-gray-400 mr-1" /> };
  if (start <= now && end >= now) return { label: 'Live', color: 'bg-green-600', icon: <FaPlayCircle className="text-green-200 mr-1 animate-pulse" /> };
  if (start > now) return { label: 'Upcoming', color: 'bg-yellow-500', icon: <FaClock className="text-yellow-100 mr-1 animate-bounce" /> };
  return { label: event.ProgressStatus, color: 'bg-gray-600', icon: null };
}

function formatDateTime(dateStr) {
  const d = new Date(dateStr);
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return d.toLocaleString(undefined, options);
}

export default function EventModule({ events }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [selectedEventTitle, setSelectedEventTitle] = useState("");

  if (!Array.isArray(events) || events.length === 0) {
    return <p className="text-center text-gray-400 py-8">No events available</p>;
  }

  function handleRegister(eventId, eventTitle) {
    setSelectedEventId(eventId);
    setSelectedEventTitle(eventTitle);
    setModalOpen(true);
  }

  function handleCloseModal() {
    setModalOpen(false);
    setSelectedEventId(null);
    setSelectedEventTitle("");
  }

  return (
    <>
      <div className="w-full flex flex-col gap-8">
        {events.map((event) => {
          const status = getEventStatus(event);
          return (
            <div key={event.EventID} className="w-full bg-slate-950 border border-slate-800 rounded-2xl shadow-xl flex flex-col md:flex-row gap-8 p-8 items-center">
              {/* Event Image */}
              <div className="w-full md:w-1/3 flex-shrink-0 flex flex-col items-center justify-center">
                <img
                  src={event.EventImage?.startsWith('http') ? event.EventImage : `/${event.EventImage}`}
                  alt={event.Title}
                  className="w-full h-56 object-cover rounded-xl shadow-lg mb-4"
                />
                <span className={`inline-flex items-center px-4 py-1 rounded-full text-xs font-bold text-white ${status.color} shadow-lg mb-2`}>
                  {status.icon} {status.label}
                </span>
                <span className="text-xs text-gray-400">{event.EventType}</span>
              </div>

              {/* Event Details */}
              <div className="flex-1 flex flex-col gap-2">
                <h2 className="text-2xl md:text-3xl font-bold text-lime-400 mb-2">{event.Title}</h2>
                <p className="text-base md:text-lg text-gray-200 mb-2">{event.Summary}</p>
                <p className="text-sm text-gray-400 mb-2">{event.Description}</p>
                <div className="flex flex-wrap gap-4 mb-2">
                  <span className="flex items-center gap-1 text-sm text-gray-300">
                    <FaCalendarAlt className="mr-1" />
                    {formatDateTime(event.StartDate)} - {formatDateTime(event.EndDate)}
                  </span>
                  <span className="flex items-center gap-1 text-sm text-gray-300"><FaMapMarkerAlt className="mr-1" /> {event.Location}</span>
                  <span className="flex items-center gap-1 text-sm text-gray-300"><FaUserTie className="mr-1" /> {event.OrganizerName} ({event.OrganizerOrganization})</span>
                  <span className="flex items-center gap-1 text-sm text-gray-300"><FaTags className="mr-1" /> {event.Tags?.split(',').map(tag => <span key={tag} className="bg-slate-800 text-lime-400 px-2 py-1 rounded-full mx-1 text-xs">{tag}</span>)}</span>
                </div>
                <div className="flex flex-wrap gap-4 mt-2 items-center">
                  <span className="text-xs bg-slate-800 text-white px-3 py-1 rounded-full">Mode: {event.Mode}</span>
                  <span className="text-xs bg-slate-800 text-white px-3 py-1 rounded-full">Payment: {event.PaymentType}</span>
                  <span className="text-xs bg-slate-800 text-white px-3 py-1 rounded-full">Registration: {event.RegistrationType}</span>
                  <span className="text-xs bg-lime-900 text-white font-bold px-3 py-1 rounded-full">Type: {event.EventType}</span>
                  {event.RegistrationType === 'Open' && (
                    <button
                      className="ml-4 px-5 py-2 bg-none hover:bg-purple-900/30 hover:cursor-pointer text-lime-300 hover:text-white font-bold rounded-full shadow-xl transition duration-150 border-2 border-lime-300"
                      onClick={() => handleRegister(event.EventID, event.Title)}
                    >
                      Register Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <EventRegistrationModal isOpen={modalOpen} onClose={handleCloseModal} eventId={selectedEventId} eventTitle={selectedEventTitle} />
    </>
  );
}
