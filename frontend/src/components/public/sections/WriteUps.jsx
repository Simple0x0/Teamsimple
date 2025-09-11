import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import WriteUpModule from '../ui/WriteupModule'; 
import Search from '../ui/Search';
import Pagination from '../ui/PaginationModule';
import Loading from '../ui/Loading';
import ErrorHandle from '../ui/ErrorHandle';
import { fetchWriteups } from '../redux/actions/writeupActions';
import { filterItems } from '../utils/searchFilter';

const WRITEUPS_PER_PAGE = 5;

export default function WriteUps() {
    const dispatch = useDispatch();
    const { writeups, loading, error, success } = useSelector((state) => state.writeups);

    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFilters, setSelectedFilters] = useState([]);

    // Fetch write-ups only once
    useEffect(() => {
        if (!success) {
            dispatch(fetchWriteups());
        }
    }, [dispatch, success]);

    const handleSearchChange = (term) => {
        setSearchTerm(term.toLowerCase());
        setCurrentPage(1);
    };

    const handleFilterChange = (filters) => {
        setSelectedFilters(filters);
        setCurrentPage(1);
    };

    const filteredWriteups = filterItems(
        writeups,
        searchTerm,
        selectedFilters,
        ['Title', 'Slug', 'Summary', 'CategoryName'],
        ['CategoryName']
    );

    const totalPages = Math.ceil(filteredWriteups.length / WRITEUPS_PER_PAGE);
    const startIndex = (currentPage - 1) * WRITEUPS_PER_PAGE;
    const endIndex = startIndex + WRITEUPS_PER_PAGE;
    const writeupsToDisplay = filteredWriteups.slice(startIndex, endIndex);

    // Early returns for loading and server error
    if (loading) return <Loading />;
    if (error) return <ErrorHandle type="WriteUp" errorType="server" />;

    // Public error if no write-ups
    if (writeups.length === 0) {
        return (
            <ErrorHandle
                type="WriteUp"
                errorType="public"
                message="Write-ups are currently not available, come back soon"
                rightbar={false}
                path="/"
            />
        );
    }

    return (
        <div key={currentPage}>
            <Search 
                title="WriteUps" 
                placeholder="Search for write-ups..." 
                filterOptions={['HackTheBox', 'TryHackMe', 'VulnLab']}
                onSearchChange={handleSearchChange}
                onFilterChange={handleFilterChange}
            />

            {filteredWriteups.length === 0 ? (
                <ErrorHandle
                    type="WriteUp"
                    errorType="public"
                    message="No write-ups matched your search."
                    rightbar={false}
                />
            ) : (
                <>
                    <WriteUpModule writeups={writeupsToDisplay} />
                    {filteredWriteups.length > WRITEUPS_PER_PAGE && (
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
