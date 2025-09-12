import React from 'react';
import { Link } from 'react-router-dom';
import { FaChevronRight, FaHashtag } from "react-icons/fa";
import { TbCategory } from "react-icons/tb";
import style from '../../../app/Style';

export default function ProjectModule({ projects = [] }) {
    return (
        <div>
            {(projects || []).map((post) => (
                <div key={post.ProjectID} className={style.projectmodule.container}>

                    {/* Cover Image */}
                    {post.CoverImage && (
                        <img 
                            src={post.CoverImage} 
                            alt={post.Title || 'Project Cover'} 
                            className={style.projectmodule.image} 
                        />
                    )}

                    {/* Summary Content */}
                    <div className={style.projectmodule.summaryContainer}>
                        
                        {/* Title */}
                        <Link to={`/projects/${post.Slug}`} className={style.projectmodule.header}>
                            {post.Title}
                        </Link>

                        {/* Description */}
                        {post.Description && (
                            <p className={style.projectmodule.summary}>{post.Description}</p>
                        )}

                        {/* Dates & Status */}
                        <div className={style.projectmodule.detailsContainer}>
                            <p><strong>Started:</strong> {new Date(post.StartDate).toLocaleDateString('en-US', {
                                year: 'numeric', month: 'short', day: 'numeric'
                            })}</p>
                            <p><strong>Status:</strong> {post.ProgressStatus}</p>
                            <p><strong>Progress:</strong> {post.ProgressPercentage}%</p>
                        </div>

                        {/* Demo & Repo Links */}
                        {(post.DemoURL || post.RepoURL) && (
                            <div className={style.projectmodule.linksContainer}>
                                {post.DemoURL && (
                                    <a 
                                        href={post.DemoURL} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className={style.projectmodule.demoButton}
                                    >
                                        Demo
                                    </a>
                                )}
                                {post.RepoURL && (
                                    <a 
                                        href={post.RepoURL} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className={style.projectmodule.repoButton}
                                    >
                                        Repo
                                    </a>
                                )}
                            </div>
                        )}

                        {/* Category */}
                        {post.Category?.Name && (
                            <div className={style.projectmodule.categoryContainer}>
                                <TbCategory className={style.projectmodule.categoryIcon} />
                                <Link 
                                    to={`/category/${post.Category.Name}`} 
                                    className={style.projectmodule.categoryText}
                                >
                                    {post.Category.Name}
                                </Link>
                            </div>
                        )}

                        {/* Tags */}
                        {post.Tags && (
                            <div className={style.projectmodule.tagsContainer}>
                                {(post.Tags ? post.Tags.split(',') : []).map((tag, index) => (
                                    <Link 
                                        to={`/tag/${tag.trim()}`} 
                                        key={index} 
                                        className={style.projectmodule.tag}
                                    >
                                        <FaHashtag className={style.projectmodule.tagIcon} /> {tag.trim()}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Read More Arrow */}
                    <Link to={`/projects/${post.Slug}`} className={style.projectmodule.readmore}>
                        <FaChevronRight />
                    </Link>
                </div>
            ))}
        </div>
    );
}
