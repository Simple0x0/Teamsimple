import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProjectModule from '../ui/ProjectModule';
import Search from '../ui/Search';
import Pagination from '../ui/PaginationModule';
import Loading from '../ui/Loading';
import ErrorHandle from '../ui/ErrorHandle';
import { fetchProjects } from '../redux/actions/projectActions';
import { filterItems } from '../utils/searchFilter';

const PROJECTS_PER_PAGE = 5;

export default function Projects() {
    const dispatch = useDispatch();
    const { projects, loading, error, success } = useSelector((state) => state.projects);

    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch projects once
    useEffect(() => {
        if (!success) {
            dispatch(fetchProjects());
        }
    }, [dispatch, success]);

    const handleSearchChange = (term) => {
        setSearchTerm(term.toLowerCase());
        setCurrentPage(1);
    };

    const filteredProjects = filterItems(
        projects,
        searchTerm,
        [], 
        ['Title', 'Description', 'TechStack'],
        []
    );

    const totalPages = Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE);
    const startIndex = (currentPage - 1) * PROJECTS_PER_PAGE;
    const endIndex = startIndex + PROJECTS_PER_PAGE;
    const projectsToDisplay = filteredProjects.slice(startIndex, endIndex);

    if (loading) return <Loading />;

    return (
        <div key={currentPage}>
            <Search 
                title="Projects" 
                placeholder="Search for projects..." 
                onSearchChange={handleSearchChange}
                showFilter={false} 
            />

            {projectsToDisplay.length === 0 && !loading ? (
                <ErrorHandle
                    type="Project"
                    errorType="public"
                    message="Projects are currently not available, come back soon"
                    rightbar={false}
                    path="/projects"
                />
            ) : (
                <ProjectModule projects={projectsToDisplay} />
            )}

            {filteredProjects.length > PROJECTS_PER_PAGE && (
                <Pagination 
                    currentPage={currentPage} 
                    totalPages={totalPages} 
                    onPageChange={setCurrentPage} 
                />
            )}

            {error && <ErrorHandle type="Project" errorType="server" />}
        </div>
    );
}
