import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import WriteUpModule from '../ui/WriteupModule'; 
import Search from '../ui/Search';
import Pagination from '../ui/PaginationModule';
import Loading from '../ui/Loading';
import ErrorMessage from '../ui/ErrorMessage';
import ErrorHandle from '../ui/ErrorHandle';
import { fetchWriteups } from '../redux/actions/writeupActions';
import { filterItems } from '../utils/searchFilter';

const WRITEUPS_PER_PAGE = 5;

export default function WriteUps() {
    const dispatch = useDispatch();
    const { writeups, loading, error } = useSelector((state) => state.writeups);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFilters, setSelectedFilters] = useState([]);

    useEffect(() => {
      if (!writeups || writeups.length === 0){
          dispatch(fetchWriteups());
      }
    }, [dispatch, writeups]);

    const handleSearchChange = (term) => {
      setSearchTerm(term);
      setCurrentPage(1);
    };

    const handleFilterChange = (filters) => {
      setSelectedFilters(filters);
      setCurrentPage(1);
    };

    // Use reusable filterItems utility here
    const filteredWriteups = filterItems(
      writeups,
      searchTerm,
      selectedFilters,
      ['Title', 'Slug', 'Summary', 'CategoryName'],     // search keys
      ['CategoryName']  // filter keys
    );

    const totalPages = Math.ceil(filteredWriteups.length / WRITEUPS_PER_PAGE);
    const startIndex = (currentPage - 1) * WRITEUPS_PER_PAGE;
    const endIndex = startIndex + WRITEUPS_PER_PAGE;
    const writeupsToDisplay = filteredWriteups.slice(startIndex, endIndex);

    if (loading) return <Loading />;
    if (error) return <ErrorHandle type="Blog" errorType="server"  />;
    //if (error) return <ErrorMessage message={error} />;

    return (
        <div key={currentPage}> 
            <Search 
                title="WriteUps" 
                placeholder="Search for write-ups..." 
                filterOptions={['HackTheBox', 'TryHackMe', 'VulnLab']}
                onSearchChange={handleSearchChange}
                onFilterChange={handleFilterChange}
            />
            <WriteUpModule writeups={writeupsToDisplay} /> 
            <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                onPageChange={setCurrentPage} 
            />
        </div>
    );
}
