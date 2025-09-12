import React from 'react';
import { Link } from 'react-router-dom';
import { FaRegHeart, FaHeart } from "react-icons/fa";
import Like from '../interactions/Like';
import style from '../../../app/Style';

export default function AchievementsModule({ achievements = [] }) {
    return (
        <div>
            <div className={style.achievementmodule.headercontainer}>
                <h1 className={style.achievementmodule.header}>Team Achievements</h1>
            </div>
            {(achievements || []).map((achieved) => (
                <div key={achieved.AchievementID} className={style.achievementmodule.container}>

                    {/* Image */}
                    <img
                        src={achieved.Image}
                        alt={achieved.Title}
                        className={style.achievementmodule.image}
                    />

                    {/* Summary Container */}
                    <div className={style.achievementmodule.summaryContainer}>
                        {/* Title */}
                        <h1 className={style.achievementmodule.title}>{achieved.Title}</h1>

                        {/* Description */}
                        <div className={style.achievementmodule.summary}>
                            <p>{achieved.Description}</p>
                            <p>
                                <strong>Achieved On:</strong>{' '}
                                {new Date(achieved.DateAchieved).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                })}
                            </p>
                        </div>
                        {/* Reference and Likes */}
                        <div className={style.achievementmodule.footerContainer}>
                            {/* Centered Reference Button */}
                            <div className={style.achievementmodule.referenceWrapper}>
                                {achieved.ReferenceURL && (
                                    <Link
                                        to={achieved.ReferenceURL}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={style.achievementmodule.referenceButton}
                                    >
                                        Reference
                                    </Link>
                                )}
                            </div>

                            {/* Likes */}
                            <div
                                className={style.likes.likesContainer}
                                onClick={() => {
                                    // Placeholder for future like update logic
                                }}
                            >
                                <Like
                                    contentType={"Achievement"}
                                    contentId={achieved.AchievementID}
                                    initialLikes={achieved.TotalLikes}
                                    HasLiked={Boolean(achieved.HasLiked)}
                                />
                                </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
