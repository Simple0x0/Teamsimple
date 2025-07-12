import React, { useState } from 'react';
import { FaShareAlt } from 'react-icons/fa';
import style from '../../../app/Style';

export default function Share({ className = "" }) {
    const [copied, setCopied] = useState(false);

    const handleShareClick = async () => {
        const url = window.location.href;
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div
            className={`relative cursor-pointer group ${className}`}
            onClick={handleShareClick}
            title="Copy link"
        >
            <FaShareAlt className="w-5 h-5 text-gray-400 hover:text-lime-400 transition" />
            {copied && (
                <span className={style.mdcontentHeader.sharecopied}>
                    Copied!
                </span>
            )}
        </div>
    );
}
