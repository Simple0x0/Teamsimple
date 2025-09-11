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

    // Only search (no filtering)
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

    // Handle loading and errors first
    if (loading) return <Loading />;
    if (error) return <ErrorHandle type="Blog" errorType="server" />;

    // Case 1: No blogs from server
    if (blogs.length === 0) {
        return (
            <ErrorHandle
                type="Blog"
                errorType="public"
                message="Blogs are currently not available, come back soon"
                rightbar={false}
                path="/"
            />
        );
    }

    return (
        <div key={currentPage}>
            <Search
                title="Blogs"
                placeholder="Search for blogs..."
                onSearchChange={handleSearchChange}
                filterOptions={[]}
                showFilter={false}
            />

            {/* Case 2: No results from search */}
            {filteredBlogs.length === 0 ? (
                <ErrorHandle
                    type="Blog"
                    errorType="public"
                    message="No blogs matched your search."
                    rightbar={false}
                />
            ) : (
                <>
                    <BlogModule blog={blogsToDisplay} />
                    {filteredBlogs.length > BLOGS_PER_PAGE && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    )}
                </>
            )}
        </div>
    );
}
