import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PodCastModule from '../ui/PodCastModule'; 
import Search from '../ui/Search';
import Pagination from '../ui/PaginationModule';
import Loading from '../ui/Loading';
import ErrorMessage from '../ui/ErrorMessage';
import ErrorHandle from '../ui/ErrorHandle';
import { fetchPodcasts } from '../redux/actions/podcastActions';
import { filterItems } from '../utils/searchFilter';

const PODCASTS_PER_PAGE = 10;

export default function PodCast() {
    const dispatch = useDispatch();
    const { podcasts, loading, error } = useSelector((state) => state.podcasts);

    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFilters, setSelectedFilters] = useState([]);

    useEffect(() => {
        if(!podcasts || podcasts.length === 0){
            dispatch(fetchPodcasts());
        }
    }, [dispatch, podcasts]);

    const handleSearchChange = (term) => {
        setSearchTerm(term.toLowerCase());
        setCurrentPage(1);
    };

    const handleFilterChange = (filters) => {
        setSelectedFilters(filters);
        setCurrentPage(1);
    };

    // Filter and search logic
    const filteredPodcasts = filterItems(
        podcasts,
        searchTerm,
        selectedFilters,
        ['Title', 'Description', 'Host', 'Guests'], // adjust these keys based on your podcast data
        ['Category'] // or 'CategoryName' if that's how it's named
    );

    const totalPages = Math.ceil(filteredPodcasts.length / PODCASTS_PER_PAGE);
    const startIndex = (currentPage - 1) * PODCASTS_PER_PAGE;
    const endIndex = startIndex + PODCASTS_PER_PAGE;
    const podcastsToDisplay = filteredPodcasts.slice(startIndex, endIndex);

    if (loading) return <Loading />;
    if (error) return <ErrorHandle type="Blog" errorType="server"  />;
    //if (error) return <ErrorMessage message={error} />;

    return (
        <div key={currentPage}> 
            <Search 
                title="Podcasts" 
                placeholder="Search for podcasts..." 
                onSearchChange={handleSearchChange}
                onFilterChange={handleFilterChange}
                filterOptions={['Latest', 'Oldest', 'Popular']} 
                showFilter={false} // toggle if filter dropdown needed
            />
            <PodCastModule podcasts={podcastsToDisplay} /> 
            <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                onPageChange={setCurrentPage} 
            />
        </div>
    );
}
