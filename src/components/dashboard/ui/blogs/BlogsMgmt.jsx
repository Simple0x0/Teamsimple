import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Pagination from '../../../public/ui/PaginationModule';
import { fetchBlogs } from '../../utils/apiRequest';
import BlogList from './BlogList';
import Search from '../../../public/ui/Search';
import Loading from '../../../public/ui/Loading';
import ErrorHandle from '../../../public/ui/ErrorHandle';
import { filterItems } from '../../../public/utils/searchFilter';
import style from '../../../../app/Style';

const BLOGS_PER_PAGE = 10;

export default function BlogsMgmt() {
  const navigate = useNavigate();
  
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const getBlogs = async () => {
      setLoading(true);
      const result = await fetchBlogs();

      if (result.success === false) {
        setError(result.error);
        setBlogs([]);
      } else {
        setBlogs(result);
        setError(null);
      }

      setLoading(false);
    };

    getBlogs();
  }, []);

  const handleSearchChange = (term) => {
    setSearchTerm(term.toLowerCase());
    setCurrentPage(1);
  };

  const handleDelete = (deletedID) => {
    setBlogs((prev) => prev.filter((b) => b.BlogID !== deletedID));
  };

  const filteredBlogs = filterItems(
    blogs,
    searchTerm,
    [],
    ['Title', 'Slug', 'Summary', 'CategoryName', 'Status'],
    []
  );
  
  const totalPages = Math.ceil(filteredBlogs.length / BLOGS_PER_PAGE);
  const startIndex = (currentPage - 1) * BLOGS_PER_PAGE;
  const endIndex = startIndex + BLOGS_PER_PAGE;
  const blogsToDisplay = filteredBlogs.slice(startIndex, endIndex);

  if (loading) return <Loading />;
  if (error) return <ErrorHandle type="Blog" errorType="server" />;

  const s = style.blogMgmt;

  return (
    <div className={s.wrapper}>
      <div className={s.header}>
        <h2 className={s.title}>Manage Blogs</h2>
        <div className={s.controls}>
          <button className={s.actionBtn} onClick={() => navigate('/dashboard/blogs/new')}>
            + Add New
          </button>
          <button className={s.actionBtn}>Export</button>
        </div>
      </div>

      <div className={s.searchBar}>
        <Search
          title="Blogs"
          placeholder="Search for blogs..."
          onSearchChange={handleSearchChange}
          filterOptions={[]}
          showFilter={false}
        />
      </div>

      <div className={s.contentArea}>
        <BlogList blogs={blogsToDisplay} showActions={true} onDelete={handleDelete}/>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
