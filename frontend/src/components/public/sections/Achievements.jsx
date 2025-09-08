import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AchievementsModule from '../ui/AchievementsModule';
import Pagination from '../ui/PaginationModule';
import Loading from '../ui/Loading';
import ErrorHandle from '../ui/ErrorHandle';
import { fetchAchievements } from '../redux/actions/achievementsActions';

const ACHIEVEMENTS_PER_PAGE = 5;

export default function Achievements() {
    const dispatch = useDispatch();
    const { achievements, loading, error, success } = useSelector((state) => state.achievements);

    const [currentPage, setCurrentPage] = useState(1);

    // Fetch achievements once
    useEffect(() => {
        if (!success) {
            dispatch(fetchAchievements());
        }
    }, [dispatch, success]);

    const totalPages = Math.ceil((achievements?.length || 0) / ACHIEVEMENTS_PER_PAGE);
    const startIndex = (currentPage - 1) * ACHIEVEMENTS_PER_PAGE;
    const endIndex = startIndex + ACHIEVEMENTS_PER_PAGE;
    const achievementsToDisplay = achievements?.slice(startIndex, endIndex) || [];

    if (loading) return <Loading />;

    return (
        <div key={currentPage}>
            {achievementsToDisplay.length === 0 && !loading ? (
                <ErrorHandle
                    type="Achievement"
                    errorType="public"
                    message="No achievements are currently available, come back soon"
                    rightbar={false}
                    path="/achievements"
                />
            ) : (
                <AchievementsModule achievements={achievementsToDisplay} />
            )}

            {achievements?.length > ACHIEVEMENTS_PER_PAGE && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}

            {error && <ErrorHandle type="Achievement" errorType="server" />}
        </div>
    );
}
