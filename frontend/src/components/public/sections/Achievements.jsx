import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AchievementsModule from '../ui/AchievementsModule';
import Pagination from '../ui/PaginationModule';
import Loading from '../ui/Loading';
import ErrorMessage from '../ui/ErrorMessage';
import ErrorHandle from '../ui/ErrorHandle';
import { fetchAchievements } from '../redux/actions/achievementsActions';

const ACHIEVEMENTS_PER_PAGE = 5;

export default function Achievements() {
    const dispatch = useDispatch();
    const { achievements, loading, error } = useSelector((state) => state.achievements);

    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        if(!achievements || achievements.length === 0 ){
            dispatch(fetchAchievements());
        }
    }, [dispatch, achievements]);

    const totalPages = Math.ceil((achievements?.length || 0) / ACHIEVEMENTS_PER_PAGE);
    const startIndex = (currentPage - 1) * ACHIEVEMENTS_PER_PAGE;
    const endIndex = startIndex + ACHIEVEMENTS_PER_PAGE;
    const achievementsToDisplay = achievements?.slice(startIndex, endIndex) || [];

    if (loading) return <Loading />;
    if (error) return <ErrorHandle type="Achievement" errorType="server"  />;
    //if (error) return <ErrorMessage message={error} />;

    return (
        <div key={currentPage}>
            <AchievementsModule achievements={achievementsToDisplay} />
            <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                onPageChange={setCurrentPage} 
            />
        </div>
    );
}
