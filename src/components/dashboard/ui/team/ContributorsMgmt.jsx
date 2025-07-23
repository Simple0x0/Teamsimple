import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Pagination from '../../../public/ui/PaginationModule';
import Search from '../../../public/ui/Search';
import Loading from '../../../public/ui/Loading';
import ErrorHandle from '../../../public/ui/ErrorHandle';
import { filterItems } from '../../../public/utils/searchFilter';
import ContributorList from './ContributorList';
import { fetchContributors } from '../../utils/apiContributorRequests';
import ContributorModal from './ContributorModal';
import MessageToast from '../MessageToast';
import style from '../../../../app/Style';

const CONTRIBUTORS_PER_PAGE = 10;

export default function ContributorsMgmt() {
  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success', duration: 3000 });
  const navigate = useNavigate();

  useEffect(() => {
    const loadContributors = async () => {
      try {
        const res = await fetchContributors();
        setContributors(res.Contributors || []);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    loadContributors();
  }, []);

  const handleSearchChange = (term) => {
    setSearchTerm(term.toLowerCase());
    setCurrentPage(1);
  };

  const handleModalSuccess = (result) => {
    const { status, data } = result;
    if (status === 'success') {
      setContributors(prev => {
        const exists = prev.find(c => c.ContributorID === data.ContributorID);
        if (exists) {
          return prev.map(c => c.ContributorID === data.ContributorID ? data : c);
        }
        return [data, ...prev];
      });
    }
    setToast({ visible: true, message: result.message, type: result.status, duration: 3000 });
    setShowModal(false);
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
  const contributorsToDisplay = filteredContributors.slice(startIndex, startIndex + CONTRIBUTORS_PER_PAGE);

  const s = style.contributorMgmt;

  if (loading) return <Loading />;
  if (error) return <ErrorHandle type="Contributors" errorType="server" />;

  return (
    <div className={s.wrapper}>
      <div className={s.header}>
        <h2 className={s.title}>Manage Contributors</h2>
        <div className={s.controls}>
          <button
            type="button"
            className={s.actionBtn}
            onClick={() => setShowModal(true)}
          >
            + Add New
          </button>
        </div>
      </div>

      <div className={s.searchBar}>
        <Search
          title="Contributors"
          placeholder="Search contributors..."
          onSearchChange={handleSearchChange}
          filterOptions={[]}
          showFilter={false}
        />
      </div>

      <div className={s.contentArea}>
        <ContributorList 
          contributors={contributorsToDisplay} 
          showActions={true} 
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      <ContributorModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleModalSuccess}
      />

      {toast.visible && (
        <MessageToast
          message={toast.message}
          duration={toast.duration}
          type={toast.type}
          onClose={() => setToast(prev => ({ ...prev, visible: false }))}
        />
      )}
    </div>
  );
}
