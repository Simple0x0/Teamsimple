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
    const { events, loading, error, success } = useSelector((state) => state.events);

    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch events once
    useEffect(() => {
        if (!success) {
            dispatch(fetchEvents());
        }
    }, [dispatch, success]);

    const handleSearchChange = (term) => {
        setSearchTerm(term.toLowerCase());
        setCurrentPage(1);
    };

    // Apply search filter
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

    // Early returns for loading and server error
    if (loading) return <Loading />;
    if (error) return <ErrorHandle type="Event" errorType="server" />;

    // Case 1: No events from server
    if (events.length === 0) {
        return (
            <ErrorHandle
                type="Event"
                errorType="public"
                message="No events are currently available, come back soon"
                rightbar={false}
                path="/"
            />
        );
    }

    return (
        <div key={currentPage}>
            <Search
                title="Events"
                placeholder="Search for events..."
                onSearchChange={handleSearchChange}
                showFilter={false}
            />

            {/* Case 2: No results from search */}
            {filteredEvents.length === 0 ? (
                <ErrorHandle
                    type="Event"
                    errorType="public"
                    message="No events matched your search."
                    rightbar={false}
                />
            ) : (
                <>
                    <EventModule events={eventsToDisplay} />
                    {filteredEvents.length > EVENTS_PER_PAGE && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    )}
                </>
            )}
        </div>
    );
}
