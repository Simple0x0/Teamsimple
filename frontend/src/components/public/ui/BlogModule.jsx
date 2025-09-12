import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import { FaChevronRight, FaHashtag } from "react-icons/fa";
import { TbCategory } from "react-icons/tb";
import Like from '../interactions/Like';
import AuthorProfileModal from '../modals/AuthorProfileModal';
import style from '../../../app/Style';

export default function BlogModule({ blog = [] }) {
    const [activeUsername, setActiveUsername] = useState(null);
    return (
        <div>
            {(blog || []).map((post) => (
                <div key={post.BlogID} className={style.blogmodule.container}>
                    {/* Image */}
                    <img src={post.BlogImage} alt={post.Title} className={style.blogmodule.image} />

                    {/* Summary Container */}
                    <div className={style.blogmodule.summaryContainer}>
                        {/* Title */}
                        <Link to={`/blogs/${post.Slug}`} className={style.blogmodule.header}>
                            {post.Title}
                        </Link>

                        {/* Summary */}
                        <p className={style.blogmodule.summary}>{post.Summary}</p>

                        {/* Contributors & Date */}
                        <div className={style.blogmodule.authordate}>
                            <p>
                                Author{(post.Contributors ? post.Contributors.split(',') : []).length > 1 ? 's' : ''}:{' '}
                                {(post.Contributors ? post.Contributors.split(',') : []).map((contributor, index) => {
                                const contributorId = (post.ContributorIDs ? post.ContributorIDs.split(',') : [])[index];
                                if (!contributor) return null;
                                return (
                                    <span key={contributorId}>
                                    <button
                                        onClick={() => setActiveUsername(contributor.trim())}
                                        className={`${style.blogmodule.author} hover:cursor-pointer`}
                                    >
                                        {contributor.trim()}
                                    </button>
                                    {index < (post.Contributors ? post.Contributors.split(',') : []).length - 1 ? ', ' : ''}
                                    </span>
                                );
                                })}
                            </p>
                            <p>
                                {new Date(post.PublishDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                })}
                            </p>
                        </div>

                        {/* Author Modal */}
                        {activeUsername && (
                        <AuthorProfileModal
                            isOpen={!!activeUsername}
                            onClose={() => setActiveUsername(null)}
                            username={activeUsername}
                        />
                        )}

                        {/* Category */}
                        <div className={style.blogmodule.categoryContainer}>
                            <TbCategory className={style.blogmodule.categoryIcon} />
                            {/*to={`/category/${post.CategoryName}`} FOR CATEGORY FILTER LATER*/} 
                            <Link to={`#`} className={style.blogmodule.categoryText}> 
                                {post.CategoryName}
                            </Link>
                        </div>

                        {/* Tags */}
                        <div className={style.blogmodule.tagsContainer}>
                            {/*to={`/tag/${tag.trim()}`}  FOR TAG FILTER LATER*/} 
                            {(post.Tags ? post.Tags.split(',') : []).map((tag, index) => (
                                <Link 
                                    to={`#`} 
                                    key={index} 
                                    className={style.blogmodule.tag}
                                >
                                    <FaHashtag className={style.blogmodule.tagIcon} /> {tag?.trim()}
                                </Link>
                            ))}
                            <div className={style.blogmodule.likes}>
                                <Like
                                    contentType="Blog"
                                    contentId={post.BlogID}
                                    initialLikes={post.TotalLikes}
                                    HasLiked={Boolean(post.HasLiked)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Read More Button */}
                    <Link to={`/blogs/${post?.Slug}`} className={style.blogmodule.readmore}>
                        <FaChevronRight />
                    </Link>
                </div>
            ))}
        </div>
    );
}
