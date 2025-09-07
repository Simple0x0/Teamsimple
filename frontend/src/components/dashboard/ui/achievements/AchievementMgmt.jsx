import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Pagination from '../../../public/ui/PaginationModule';
import { fetchAchievements } from '../../utils/apiAchievementRequests';
import AchievementList from './AchievementList';
import Search from '../../../public/ui/Search';
import Loading from '../../../public/ui/Loading';
import ErrorHandle from '../../../public/ui/ErrorHandle';
import { filterItems } from '../../../public/utils/searchFilter';
import style from '../../../../app/Style';

const ACHIEVEMENTS_PER_PAGE = 10;

export default function AchievementMgmt() {
  const navigate = useNavigate();

  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const getAchievements = async () => {
      setLoading(true);
      const result = await fetchAchievements();

      if (result.success === false) {
        setError(result.error);
        setAchievements([]);
      } else {
        setAchievements(result);
        setError(null);
      }

      setLoading(false);
    };

    getAchievements();
  }, []);

  const handleSearchChange = (term) => {
    setSearchTerm(term.toLowerCase());
    setCurrentPage(1);
  };

  const handleDelete = (deletedID) => {
    setAchievements((prev) => prev.filter((a) => a.AchievementID !== deletedID));
  };

  const filteredAchievements = filterItems(
    achievements,
    searchTerm,
    [],
    ['Title', 'Description', 'ReferenceURL', 'Status'],
    []
  );

  const totalPages = Math.ceil(filteredAchievements.length / ACHIEVEMENTS_PER_PAGE);
  const startIndex = (currentPage - 1) * ACHIEVEMENTS_PER_PAGE;
  const endIndex = startIndex + ACHIEVEMENTS_PER_PAGE;
  const achievementsToDisplay = filteredAchievements.slice(startIndex, endIndex);

  if (loading) return <Loading />;
  if (error) return <ErrorHandle type="Achievement" errorType="server" />;

  const s = style.blogMgmt;

  return (
    <div className={s.wrapper}>
      <div className={s.header}>
        <h2 className={s.title}>Manage Achievements</h2>
        <div className={s.controls}>
          <button className={s.actionBtn} onClick={() => navigate('/dashboard/achievements/new')}>
            + Add New
          </button>
          <button className={s.actionBtn}>Export</button>
        </div>
      </div>

      <div className={s.searchBar}>
        <Search
          title="Achievements"
          placeholder="Search for achievements..."
          onSearchChange={handleSearchChange}
          filterOptions={[]}
          showFilter={false}
        />
      </div>

      <div className={s.contentArea}>
        <AchievementList achievements={achievementsToDisplay} showActions={true} onDelete={handleDelete}/>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
