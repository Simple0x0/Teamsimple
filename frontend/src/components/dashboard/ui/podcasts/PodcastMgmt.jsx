import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Pagination from '../../../public/ui/PaginationModule';
import { fetchPodcasts } from '../../utils/apiPodcastRequests';
import PodcastList from './PodcastList';
import Search from '../../../public/ui/Search';
import Loading from '../../../public/ui/Loading';
import ErrorHandle from '../../../public/ui/ErrorHandle';
import { filterItems } from '../../../public/utils/searchFilter';
import style from '../../../../app/Style';

const PODCASTS_PER_PAGE = 5;

export default function PodcastMgmt() {
  const navigate = useNavigate();

  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const getPodcasts = async () => {
      setLoading(true);
      const result = await fetchPodcasts();

      if (result.success === false) {
        setError(result.error);
        setPodcasts([]);
      } else {
        setPodcasts(result);
        setError(null);
      }

      setLoading(false);
    };

    getPodcasts();
  }, []);

  const handleSearchChange = (term) => {
    setSearchTerm(term.toLowerCase());
    setCurrentPage(1);
  };

  const handleDelete = (deletedID) => {
    setPodcasts((prev) => prev.filter((p) => p.PodcastID !== deletedID));
  };

  const filteredPodcasts = filterItems(
    podcasts,
    searchTerm,
    [],
    ['Title', 'Slug', 'Description', 'CategoryName', 'Status', 'EpisodeNumber'],
    []
  );

  const totalPages = Math.ceil(filteredPodcasts.length / PODCASTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PODCASTS_PER_PAGE;
  const endIndex = startIndex + PODCASTS_PER_PAGE;
  const podcastsToDisplay = filteredPodcasts.slice(startIndex, endIndex);

  if (loading) return <Loading />;
  if (error) return <ErrorHandle type="Podcast" errorType="server" />;

  const s = style.blogMgmt;

  return (
    <div className={s.wrapper}>
      <div className={s.header}>
        <h2 className={s.title}>Manage Podcasts</h2>
        <div className={s.controls}>
          <button className={s.actionBtn} onClick={() => navigate('/dashboard/podcasts/new')}>
            + Add New
          </button>
          <button className={s.actionBtn}>Export</button>
        </div>
      </div>

      <div className={s.searchBar}>
        <Search
          title="Podcasts"
          placeholder="Search for podcasts..."
          onSearchChange={handleSearchChange}
          filterOptions={[]}
          showFilter={false}
        />
      </div>

      <div className={s.contentArea}>
        <PodcastList
          podcasts={podcastsToDisplay}
          showActions={true}
          onDelete={handleDelete}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
