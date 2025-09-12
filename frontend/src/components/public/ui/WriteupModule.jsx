import React from 'react';
import style from '../../../app/Style';
import { Link } from 'react-router-dom';

export default function WriteUpModule({ writeups = [] }) {
    if (!Array.isArray(writeups) || writeups.length === 0) {
        return <p>No write-ups available</p>;
    }

    return (
        <div>
            <div className={style.WriteupModule.container}>
                {(writeups || []).map((post) => (
                    <div key={post.WriteUpID} className={style.WriteupModule.item}>
                        <div className={style.WriteupModule.ImageName}> 
                            <Link to={`/writeups/${post.Slug}`} className="block">
                                <img 
                                    src={post.WriteUpImage} 
                                    alt={post.MachineName ?? 'Write-up image'} 
                                    className={style.WriteupModule.image} 
                                />
                                <h3 className={style.WriteupModule.machineName}>
                                    {post.MachineName ?? 'Unnamed Machine'}
                                </h3>
                            </Link>
                        </div>
                        <div className={style.WriteupModule.details}>
                            <p className={style.WriteupModule.difficulty}>
                                {post.CategoryName ?? 'Uncategorized'} - {post.Difficulty ?? 'Unknown'}
                            </p>
                            <p className={style.WriteupModule.difficulty}>
                                {post.OsType ?? 'Unknown OS'}
                            </p>
                        </div>
                        <Link to={`/writeups/${post.Slug}`} className={style.WriteupModule.readmore}>
                            Read More
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
