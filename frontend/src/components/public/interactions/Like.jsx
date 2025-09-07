import React, { useState, useEffect } from 'react';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { handleLike } from '../utils/handleLike';
import style from '../../../app/Style';

export default function Like({ contentType, contentId, initialLikes = 0, HasLiked }) {
    const [likeCount, setLikeCount] = useState(initialLikes);
    const [hasLiked, setHasLiked] = useState(false);
    const [hovered, setHovered] = useState(false);

    useEffect(() => {
        setHasLiked(HasLiked);
    }, [HasLiked]);

    const handleLikeClick = () => {
        if (hasLiked) return;

        handleLike(
            contentType,
            contentId,
            () => {
                setLikeCount(prev => prev + 1);
                setHasLiked(true);
            },
            () => {
                setHasLiked(true);
            },
            (err) => {
                console.error('Like failed:', err);
            }
        );
    };
    return (
        <div
            className={style.likes.likesContainer}
            onClick={handleLikeClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            title={hasLiked ? 'You liked this post' : 'Click to like'}
        >
            {(hasLiked || hovered) ? (
                <FaHeart className={style.likes.likedIcon} />
            ) : (
                <FaRegHeart className={style.likes.likeIcon} />
            )}
            <span className={style.likes.likesCount}>{likeCount}</span>
        </div>
    );
}
