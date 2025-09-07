// components/modals/AuthorProfileModal.jsx
import React, { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';
import { getAuthor } from '../utils/getAuthor';
import style from '../../../app/Style';
import Loading from '../ui/Loading';
//import ErrorMessage from '../ui/ErrorMessage';
import ErrorHandle from '../ui/ErrorHandle';

export default function AuthorProfileModal({ isOpen, onClose, username }) {
    const [author, setAuthor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isOpen) return;

        setLoading(true);
        setError(null);

        getAuthor(username, (err) => setError(err?.message || 'Failed to fetch author'))
            .then(data => setAuthor(data))
            .finally(() => setLoading(false));
    }, [username, isOpen]);

    return (
        <Dialog open={isOpen} onClose={onClose} className={style.Modal.Dialog}>
            <div className="fixed inset-0 bg-black/15" aria-hidden="true" />
            <div className={style.Modal.ContentContainer}>
                <Dialog.Panel className={style.Modal.DialogPanel}>
                    {/* Header */}
                    <div className={style.Modal.HeaderContainer}>
                        <Dialog.Title className={style.Modal.Title}>
                            {author?.FullName ?? author?.Username ?? 'Loading Bio ...'}
                        </Dialog.Title>
                        <button onClick={onClose} className={style.Modal.XButton}>
                            <X size={24} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className={style.Modal.TextArea}>
                        {loading ? (
                            <Loading />
                        ) : error ? (
                            <ErrorHandle type="Bio" errorType="server" />
                        ) : (
                            <div className="space-y-4">
                                {/* Profile Picture */}
                                <img
                                    src={author?.ProfilePicture ?? '/default-avatar.jpg'}
                                    alt={author?.Username ?? 'Member'}
                                    className={style.ProfileModal.image}
                                />
                                {/* Username */}
                                <h4 className={style.ProfileModal.username} >{author?.Username ?? 'unknown'}</h4>
                                {/* Bio */}
                                <p className={style.ProfileModal.bio}>{author?.Bio ?? ''}</p>

                                {/* Social Links */}
                                {Array.isArray(author?.SocialLinks) && author.SocialLinks.length > 0 && (
                                    <div className={style.ProfileModal.socialLinkContainer}>
                                        {author.SocialLinks.map((link, idx) => (
                                            <a
                                                key={idx}
                                                href={link?.URL ?? '#'}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={style.ProfileModal.socialLink}
                                            >
                                                {link?.Platform ?? ''}
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
}

