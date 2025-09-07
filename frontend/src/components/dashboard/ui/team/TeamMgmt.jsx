import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Pagination from '../../../public/ui/PaginationModule';
import Search from '../../../public/ui/Search';
import Loading from '../../../public/ui/Loading';
import ErrorHandle from '../../../public/ui/ErrorHandle';
import { filterItems } from '../../../public/utils/searchFilter';
import TeamList from './TeamList';
import { fetchTeamMembers } from '../../utils/apiTeamRequest';
import TeamModal from './TeamModal';
import MessageToast from '../MessageToast';
import style from '../../../../app/Style';

const MEMBERS_PER_PAGE = 10;

export default function TeamMgmt() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success', duration: 3000 });
  const navigate = useNavigate();

  useEffect(() => {
    const loadMembers = async () => {
      try {
        const res = await fetchTeamMembers();
        setMembers(res.members || []);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    loadMembers();
  }, []);

  const handleSearchChange = (term) => {
    setSearchTerm(term.toLowerCase());
    setCurrentPage(1);
  };

  const handleModalSuccess = (result) => {
    const { status, data } = result;
    if (status === 'success') {
      setMembers(prev => {
        const exists = prev.find(m => m.TeamID === data.TeamID);
        if (exists) {
          return prev.map(m => m.TeamID === data.TeamID ? data : m);
        }
        return [data, ...prev];
      });
    }
    setToast({ visible: true, message: result.message, type: result.status, duration: 3000 });
    setShowModal(false);
  };

  const filteredMembers = filterItems(
    members,
    searchTerm,
    [],
    ['Username', 'FullName', 'Status', 'Role'],
    []
  );

  const totalPages = Math.ceil(filteredMembers.length / MEMBERS_PER_PAGE);
  const startIndex = (currentPage - 1) * MEMBERS_PER_PAGE;
  const endIndex = startIndex + MEMBERS_PER_PAGE;
  const membersToDisplay = filteredMembers.slice(startIndex, endIndex);

  const s = style.contributorMgmt;

  if (loading) return <Loading />;
  if (error) return <ErrorHandle type="Team Members" errorType="server" />;

  return (
    <div className={s.wrapper}>
      <div className={s.header}>
        <h2 className={s.title}>Team Management</h2>
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
          title="Team Members"
          placeholder="Search team members..."
          onSearchChange={handleSearchChange}
          filterOptions={[]}
          showFilter={false}
        />
      </div>

      <div className={s.contentArea}>
        <TeamList 
          team={membersToDisplay} 
          showActions={true} 
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      <TeamModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleModalSuccess}
        New={true}
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