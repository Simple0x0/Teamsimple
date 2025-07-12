import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Pagination from '../../../public/ui/PaginationModule';
import { fetchProjects } from '../../utils/apiProjectRequests';
import ProjectList from './ProjectList';
import Search from '../../../public/ui/Search';
import Loading from '../../../public/ui/Loading';
import ErrorHandle from '../../../public/ui/ErrorHandle';
import { filterItems } from '../../../public/utils/searchFilter';
import style from '../../../../app/Style';

const PROJECTS_PER_PAGE = 10;

export default function ProjectMgmt() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const getProjects = async () => {
      setLoading(true);
      const result = await fetchProjects();

      if (result.success === false) {
        setError(result.error);
        setProjects([]);
      } else {
        setProjects(result);
        setError(null);
      }

      setLoading(false);
    };

    getProjects();
  }, []);

  const handleSearchChange = (term) => {
    setSearchTerm(term.toLowerCase());
    setCurrentPage(1);
  };

  const handleDelete = (deletedID) => {
    setProjects((prev) => prev.filter((p) => p.ProjectID !== deletedID));
  };

  const filteredProjects = filterItems(
    projects,
    searchTerm,
    [],
    ['Title', 'Slug', 'Summary', 'CategoryName', 'Status', 'ProgressPercentage'],
    []
  );

  const totalPages = Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PROJECTS_PER_PAGE;
  const endIndex = startIndex + PROJECTS_PER_PAGE;
  const projectsToDisplay = filteredProjects.slice(startIndex, endIndex);

  if (loading) return <Loading />;
  if (error) return <ErrorHandle type="Project" errorType="server" />;

  const s = style.blogMgmt;

  return (
    <div className={s.wrapper}>
      <div className={s.header}>
        <h2 className={s.title}>Manage Projects</h2>
        <div className={s.controls}>
          <button className={s.actionBtn} onClick={() => navigate('/dashboard/projects/new')}>
            + Add New
          </button>
          <button className={s.actionBtn}>Export</button>
        </div>
      </div>

      <div className={s.searchBar}>
        <Search
          title="Projects"
          placeholder="Search for projects..."
          onSearchChange={handleSearchChange}
          filterOptions={[]}
          showFilter={false}
        />
      </div>

      <div className={s.contentArea}>
        <ProjectList projects={projectsToDisplay} showActions={true} onDelete={handleDelete} />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
