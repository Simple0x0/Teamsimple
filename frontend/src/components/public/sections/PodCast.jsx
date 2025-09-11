import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PodCastModule from '../ui/PodCastModule'; 
import Search from '../ui/Search';
import Pagination from '../ui/PaginationModule';
import Loading from '../ui/Loading';
import ErrorHandle from '../ui/ErrorHandle';
import { fetchPodcasts } from '../redux/actions/podcastActions';
import { filterItems } from '../utils/searchFilter';

const PODCASTS_PER_PAGE = 5;

export default function PodCast() {
    const dispatch = useDispatch();
    const { podcasts, loading, error, success } = useSelector((state) => state.podcasts);

    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch podcasts once on mount
    useEffect(() => {
        if (!success) {
            dispatch(fetchPodcasts());
        }
    }, [dispatch, success]);

    const handleSearchChange = (term) => {
        setSearchTerm(term.toLowerCase());
        setCurrentPage(1);
    };

    // Apply search filter
    const filteredPodcasts = filterItems(
        podcasts,
        searchTerm,
        [], // no filter tags yet, can extend later
        ['Title', 'Description', 'Host', 'Guests'],
        ['Category']
    );

    const totalPages = Math.ceil(filteredPodcasts.length / PODCASTS_PER_PAGE);
    const startIndex = (currentPage - 1) * PODCASTS_PER_PAGE;
    const endIndex = startIndex + PODCASTS_PER_PAGE;
    const podcastsToDisplay = filteredPodcasts.slice(startIndex, endIndex);

    // Early returns for loading and server error
    if (loading) return <Loading />;
    if (error) return <ErrorHandle type="Podcast" errorType="server" />;

    // Public error if no podcasts
    if (podcastsToDisplay.length === 0) {
        return (
            <ErrorHandle
                type="Podcast"
                errorType="public"
                message="Podcasts are currently not available, come back soon"
                rightbar={false}
                path="/"
            />
        );
    }

    return (
        <div key={currentPage}>
            <Search 
                title="Podcasts" 
                placeholder="Search for podcasts..." 
                onSearchChange={handleSearchChange}
                showFilter={false} 
            />
            <PodCastModule podcasts={podcastsToDisplay} />
            {filteredPodcasts.length > PODCASTS_PER_PAGE && (
                <Pagination 
                    currentPage={currentPage} 
                    totalPages={totalPages} 
                    onPageChange={setCurrentPage} 
                />
            )}
        </div>
    );
}
