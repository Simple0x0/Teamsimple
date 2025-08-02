import React, { useEffect, useState, Fragment } from 'react';
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
import { fetchEvents, postEvent, fetchEventParticipants } from '../../utils/apiEventRequest';
import Search from '../../../public/ui/Search';

export default function EventParticipants() {
  const s = style.EventParticipants;
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [filteredParticipants, setFilteredParticipants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      try {
        const res = await fetchEvents();
        const eventList = res.Events || [];
        setEvents(eventList);
        if (eventList.length > 0) {
          // Find most recent event by StartDate
          const sorted = [...eventList].sort((a, b) => new Date(b.StartDate) - new Date(a.StartDate));
          setSelectedEvent(sorted[0]);
        }
      } catch (e) {
        setError('Failed to load events.');
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, []);

  useEffect(() => {
    const loadParticipants = async () => {
      if (!selectedEvent) return;
      setLoading(true);
      try {
        const res = await fetchEventParticipants(selectedEvent.EventID);
        setParticipants(res.Participants || []);
        setFilteredParticipants(res.Participants || []);
      } catch (e) {
        setError('Failed to load participants.');
      } finally {
        setLoading(false);
      }
    };
    loadParticipants();
  }, [selectedEvent]);

  const handleEventChange = (e) => {
    const eventId = parseInt(e.target.value, 10);
    const eventObj = events.find(ev => ev.EventID === eventId);
    setSelectedEvent(eventObj);
    setSearchTerm('');
  };

  const handleSearchChange = (term) => {
    setSearchTerm(term);
    if (!term) {
      setFilteredParticipants(participants);
      return;
    }
    const lower = term.toLowerCase();
    setFilteredParticipants(
      participants.filter(p =>
        (p.Email && p.Email.toLowerCase().includes(lower)) ||
        (p.Nickname && p.Nickname.toLowerCase().includes(lower)) || 
        (p.FirstName && p.FirstName.toLowerCase().includes(lower)) ||
        (p.LastName && p.LastName.toLowerCase().includes(lower)) ||
        (p.Organization && p.Organization.toLowerCase().includes(lower)) ||
        (p.Country && p.Country.toLowerCase().includes(lower)) ||
        (p.RegistrationType && p.RegistrationType.toLowerCase().includes(lower))
      )
    );
  };

  return (
    <div className={s.wrapper}>
      <h2 className={s.title}>Event Participants</h2>
      {error && <div className={s.error}>{error}</div>}
      <div className={s.controls}>
        <label htmlFor="event-select" className={s.label}>Select Event: </label>
        <select
          id="event-select"
          value={selectedEvent?.EventID || ''}
          onChange={handleEventChange}
          className={s.select}
        >
          {events.map(ev => (
            <option key={ev.EventID} value={ev.EventID}>{ev.Title}</option>
          ))}
        </select>
        <div className={s.searchBar}>
          <Search
            title="Participants"
            placeholder="Search by email or nickname..."
            onSearchChange={handleSearchChange}
            filterOptions={[]}
            showFilter={false}
          />
        </div>
      </div>
      <div className="w-full flex flex-col md:flex-row md:justify-between items-center mb-2">
        <span className="text-lime-400 font-semibold text-sm md:text-base">
          Total Participants: {participants.length}
        </span>
      </div>
      {loading ? (
        <div className={s.loading}>Loading participants...</div>
      ) : (
        <div className="overflow-x-auto w-full">
          <table className={s.table}>
            <thead>
              <tr>
                <th className={s.th}>Name</th>
                <th className={s.th}>Nickname</th>
                <th className={s.th}>Email</th>
                <th className={s.th}>Organization</th>
                <th className={s.th}>Registration Type</th>
                <th className={s.th}>Country</th>
              </tr>
            </thead>
            <tbody>
              {filteredParticipants.length === 0 ? (
                <tr><td className={s.noData} colSpan="6">No participants found.</td></tr>
              ) : (
                filteredParticipants.map((p, idx) => (
                  <tr key={idx} className={s.tr}>
                    <td className={s.td}>{p.FirstName} {p.LastName}</td>
                    <td className={s.td}>{p.Nickname}</td>
                    <td className={s.td}>{p.Email}</td>
                    <td className={s.td}>{p.Organization}</td>
                    <td className={s.td}>{p.RegistrationType}</td>
                    <td className={s.td}>{p.Country}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}