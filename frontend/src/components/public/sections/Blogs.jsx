import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BlogModule from '../ui/BlogModule';
import Search from '../ui/Search';
import Loading from '../ui/Loading';
import ErrorMessage from '../ui/ErrorMessage';
import ErrorHandle from '../ui/ErrorHandle';
import Pagination from '../ui/PaginationModule';
import { fetchBlogs } from '../redux/actions/blogActions';
import { filterItems } from '../utils/searchFilter';

const BLOGS_PER_PAGE = 5;

export default function Blogs() {
    const dispatch = useDispatch();
    const { blogs, loading, error } = useSelector((state) => state.blogs);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
         if (!blogs || blogs.length === 0) {
            dispatch(fetchBlogs());
        }
    }, [dispatch, blogs]);

    const handleSearchChange = (term) => {
        setSearchTerm(term.toLowerCase());
        setCurrentPage(1);
    };

    // Only search (no filtering)
    const filteredBlogs = filterItems(
        blogs,
        searchTerm,
        [],
        ['Title', 'Slug', 'Summary', 'CategoryName'],
        [] // No filters for now
    );

    const totalPages = Math.ceil(filteredBlogs.length / BLOGS_PER_PAGE);
    const startIndex = (currentPage - 1) * BLOGS_PER_PAGE;
    const endIndex = startIndex + BLOGS_PER_PAGE;
    const blogsToDisplay = filteredBlogs.slice(startIndex, endIndex);

    if (loading) return <Loading />;
    if (error) return <ErrorHandle type="Blog" errorType="server"  />;
    //if (error) return <ErrorMessage message={error} />;

    return (
        <div key={currentPage}>
            <Search 
                title="Blogs" 
                placeholder="Search for blogs..." 
                onSearchChange={handleSearchChange}
                filterOptions={[]} // No filter options needed
                showFilter={false}
            />
            <BlogModule blog={blogsToDisplay} />
            <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                onPageChange={setCurrentPage} 
            />
        </div>
    );
}
