// FooterNav.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import style from '../../../app/Style';

export default function FooterNav({ contentsList = [], currentSlug, basePath = '' }) {
    const currentIndex = contentsList.findIndex(post => post.Slug === currentSlug);
    const previous = currentIndex > 0 ? contentsList[currentIndex - 1] : null;
    const next = currentIndex < contentsList.length - 1 ? contentsList[currentIndex + 1] : null;

    return (
        <div className={style.mdcontentFooter.uppercontainer}>
            <div className={style.mdcontentFooter.maincontainer}>
                <div className="w-1/2">
                    {previous ? (
                        <Link
                            to={`${basePath}/${previous.Slug}`}
                            className={style.mdcontentFooter.link}
                        >
                           ← {resolveTitle(previous)}
                        </Link>
                    ) : (
                        <div className={style.mdcontentFooter.disabled}>Start of series</div>
                    )}
                </div>
                <div className="w-1/2 text-right">
                    {next ? (
                        <Link
                            to={`${basePath}/${next.Slug}`}
                            className={style.mdcontentFooter.link}
                        >
                            {resolveTitle(next)} →
                        </Link>
                    ) : (
                        <div className={style.mdcontentFooter.disabled}>End of series</div>
                    )}
                </div>
            </div>
        </div>
    );
}


function resolveTitle(item) {
    if (!item) return '';
    if (item.Title) return item.Title; // Blog, Project
    if (item.MachineName) return item.MachineName; // WriteUp
    if (item.EpisodeTitle) return item.EpisodeTitle; // Podcast
    return item.Slug; // Fallback
}