import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProjectModule from '../ui/ProjectModule';
import Search from '../ui/Search';
import Pagination from '../ui/PaginationModule';
import Loading from '../ui/Loading';
import ErrorMessage from '../ui/ErrorMessage';
import ErrorHandle from '../ui/ErrorHandle';
import { fetchProjects } from '../redux/actions/projectActions';
import { filterItems } from '../utils/searchFilter';

const PROJECTS_PER_PAGE = 5;

export default function Projects() {
    const dispatch = useDispatch();
    const { projects, loading, error } = useSelector((state) => state.projects);

    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if(!projects || projects.length === 0){
            dispatch(fetchProjects());
        }
    }, [dispatch, projects]);

    const handleSearchChange = (term) => {
        setSearchTerm(term.toLowerCase());
        setCurrentPage(1);
    };

    // Filter based on project name, description, or tech used
    const filteredProjects = filterItems(
        projects,
        searchTerm,
        [], // no dropdown filters
        ['Title', 'Description', 'TechStack'], // search fields
        [] // no filter keys
    );

    const totalPages = Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE);
    const startIndex = (currentPage - 1) * PROJECTS_PER_PAGE;
    const endIndex = startIndex + PROJECTS_PER_PAGE;
    const projectsToDisplay = filteredProjects.slice(startIndex, endIndex);

    if (loading) return <Loading />;
    if (error) return <ErrorHandle type="Blog" errorType="server"  />;
    //if (error) return <ErrorMessage message={error} />;

    return (
        <div key={currentPage}>
            <Search 
                title="Projects" 
                placeholder="Search for projects..." 
                onSearchChange={handleSearchChange}
                showFilter={false} // Hides dropdown to make search full-width
            />
            <ProjectModule projects={projectsToDisplay} />
            <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                onPageChange={setCurrentPage} 
            />
        </div>
    );
}
