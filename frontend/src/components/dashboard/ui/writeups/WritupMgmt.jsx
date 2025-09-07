import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Pagination from '../../../public/ui/PaginationModule';
import { fetchWriteUps } from '../../utils/apiWriteUpRequests';
import WritupList from './WritupList';
import Search from '../../../public/ui/Search';
import Loading from '../../../public/ui/Loading';
import ErrorHandle from '../../../public/ui/ErrorHandle';
import { filterItems } from '../../../public/utils/searchFilter';
import style from '../../../../app/Style';

const WRITEUPS_PER_PAGE = 10;

export default function WriteUpMgmt() {
  const navigate = useNavigate();

  const [writeups, setWriteups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const getWriteUps = async () => {
      setLoading(true);
      const result = await fetchWriteUps();

      if (result.success === false) {
        setError(result.error);
        setWriteups([]);
      } else {
        setWriteups(result);
        setError(null);
      }

      setLoading(false);
    };

    getWriteUps();
  }, []);

  const handleSearchChange = (term) => {
    setSearchTerm(term.toLowerCase());
    setCurrentPage(1);
  };

  const handleDelete = (deletedID) => {
    setWriteups((prev) => prev.filter((w) => w.WriteUpID !== deletedID));
  };

  const filteredWriteUps = filterItems(
    writeups,
    searchTerm,
    [],
    ['Title', 'Slug', 'Summary', 'CategoryName', 'Status'],
    []
  );

  const totalPages = Math.ceil(filteredWriteUps.length / WRITEUPS_PER_PAGE);
  const startIndex = (currentPage - 1) * WRITEUPS_PER_PAGE;
  const endIndex = startIndex + WRITEUPS_PER_PAGE;
  const writeupsToDisplay = filteredWriteUps.slice(startIndex, endIndex);

  if (loading) return <Loading />;
  if (error) return <ErrorHandle type="WriteUp" errorType="server" />;

  const s = style.blogMgmt;

  return (
    <div className={s.wrapper}>
      <div className={s.header}>
        <h2 className={s.title}>Manage WriteUps</h2>
        <div className={s.controls}>
          <button className={s.actionBtn} onClick={() => navigate('/dashboard/writeups/new')}>
            + Add New
          </button>
          <button className={s.actionBtn}>Export</button>
        </div>
      </div>

      <div className={s.searchBar}>
        <Search
          title="WriteUps"
          placeholder="Search for writeups..."
          onSearchChange={handleSearchChange}
          filterOptions={[]}
          showFilter={false}
        />
      </div>

      <div className={s.contentArea}>
        <WritupList writeups={writeupsToDisplay} showActions={true} onDelete={handleDelete}/>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
