import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BlogModule from '../ui/BlogModule';
import Search from '../ui/Search';
import Loading from '../ui/Loading';
import ErrorHandle from '../ui/ErrorHandle';
import Pagination from '../ui/PaginationModule';
import { fetchBlogs } from '../redux/actions/blogActions';
import { filterItems } from '../utils/searchFilter';

const BLOGS_PER_PAGE = 5;

export default function Blogs() {
    const dispatch = useDispatch();
    const { blogs, loading, error, success } = useSelector((state) => state.blogs);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch blogs once on mount
    useEffect(() => {
        if (!success) {
            dispatch(fetchBlogs());
        }
    }, [dispatch, success]);

    const handleSearchChange = (term) => {
        setSearchTerm(term.toLowerCase());
        setCurrentPage(1);
    };

    const filteredBlogs = filterItems(
        blogs,
        searchTerm,
        [],
        ['Title', 'Slug', 'Summary', 'CategoryName'],
        []
    );

    const totalPages = Math.ceil(filteredBlogs.length / BLOGS_PER_PAGE);
    const startIndex = (currentPage - 1) * BLOGS_PER_PAGE;
    const endIndex = startIndex + BLOGS_PER_PAGE;
    const blogsToDisplay = filteredBlogs.slice(startIndex, endIndex);

    if (loading) return <Loading />;

    return (
        <div key={currentPage}>
            <Search
                title="Blogs"
                placeholder="Search for blogs..."
                onSearchChange={handleSearchChange}
                filterOptions={[]}
                showFilter={false}
            />

            {blogsToDisplay.length === 0 && !loading ? (
                <ErrorHandle
                    type="Blog"
                    errorType="public"
                    message="Blogs are currently not available, come back soon"
                    rightbar={false}
                    path="/blogs"
                />
            ) : (
                <BlogModule blog={blogsToDisplay} />
            )}

            {filteredBlogs.length > BLOGS_PER_PAGE && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}

            {error && <ErrorHandle type="Blog" errorType="server" />}
        </div>
    );
}
