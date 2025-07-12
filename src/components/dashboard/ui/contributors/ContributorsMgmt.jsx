import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Pagination from '../../../public/ui/PaginationModule';
import Search from '../../../public/ui/Search';
import Loading from '../../../public/ui/Loading';
import ErrorHandle from '../../../public/ui/ErrorHandle';
import { filterItems } from '../../../public/utils/searchFilter';
import ContributorList from './ContributorList';
import { fetchContributors } from '../../utils/apiRequest';
import style from '../../../../app/Style';

const CONTRIBUTORS_PER_PAGE = 10;

export default function ContributorsMgmt() {
  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const loadContributors = async () => {
      try {
        const res = await fetchContributors();
        setContributors(res.Contributors || []);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };
    loadContributors();
  }, []);

  const handleSearchChange = (term) => {
    setSearchTerm(term.toLowerCase());
    setCurrentPage(1);
  };

  const filteredContributors = filterItems(
    contributors,
    searchTerm,
    [],
    ['Username', 'FullName', 'Bio', 'Type'],
    []
  );

  const totalPages = Math.ceil(filteredContributors.length / CONTRIBUTORS_PER_PAGE);
  const startIndex = (currentPage - 1) * CONTRIBUTORS_PER_PAGE;
  const endIndex = startIndex + CONTRIBUTORS_PER_PAGE;
  const contributorsToDisplay = filteredContributors.slice(startIndex, endIndex);

  const s = style.contributorMgmt;

  if (loading) return <Loading />;
  if (error) return <ErrorHandle type="Contributors" errorType="server" />;

  return (
    <div className={s.wrapper}>
      <div className={s.header}>
        <h2 className={s.title}>Manage Contributors</h2>
        <div className={s.controls}>
          <button className={s.actionBtn} onClick={() => navigate('/dashboard/contributors/add')}>
            + Add New
          </button>
        </div>
      </div>

      <div className={s.searchBar}>
        <Search
          title="Contributors"
          placeholder="Search for contributors..."
          onSearchChange={handleSearchChange}
          filterOptions={[]}
          showFilter={false}
        />
      </div>

      <div className={s.contentArea}>
        <ContributorList contributors={contributorsToDisplay} showActions={true} />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
