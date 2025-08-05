import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import EventModule from '../contents/EventRender/EventModule';
import Search from '../ui/Search';
import Pagination from '../ui/PaginationModule';
import Loading from '../ui/Loading';
import ErrorHandle from '../ui/ErrorHandle';
import { fetchEvents } from '../redux/actions/eventActions';
import { filterItems } from '../utils/searchFilter';

const EVENTS_PER_PAGE = 5;

export default function Events() {
  const dispatch = useDispatch();
  const { events, loading, error } = useSelector((state) => state.events);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!events || events.length === 0) {
      dispatch(fetchEvents());
    }
  }, [dispatch, events]);

  const handleSearchChange = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const filteredEvents = filterItems(
    events,
    searchTerm,
    [],
    ['Title', 'Description', 'Location'],
    []
  );

  const totalPages = Math.ceil(filteredEvents.length / EVENTS_PER_PAGE);
  const startIndex = (currentPage - 1) * EVENTS_PER_PAGE;
  const endIndex = startIndex + EVENTS_PER_PAGE;
  const eventsToDisplay = filteredEvents.slice(startIndex, endIndex);

  if (loading) return <Loading />;
  if (error) return <ErrorHandle type="Event" errorType="server" />;

  return (
    <div key={currentPage}>
      <Search
        title="Events"
        placeholder="Search for events..."
        onSearchChange={handleSearchChange}
        showFilter={false}
      />
      <EventModule events={eventsToDisplay} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
