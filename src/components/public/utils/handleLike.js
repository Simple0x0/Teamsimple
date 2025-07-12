import axios from 'axios';
import { getFingerprint } from './getVisitorInfo';

/**
 * Handle Like Action (Fingerprint-based only)
 * @param {string} contentType - e.g. 'Blog'
 * @param {number|string} contentID - Content ID
 * @param {function} onSuccess - Callback if like succeeded
 * @param {function} onAlreadyLiked - Callback if already liked (409)
 * @param {function} onError - Callback for other errors
 */
export async function handleLike(contentType, contentID, onSuccess, onAlreadyLiked, onError) {
    if (!contentType || !contentID) return;

    try {
        const fingerprint = await getFingerprint();

        const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/like`, {
            contentType,
            contentID,
            fingerprint,
        });

        if (res.status === 200 || res.status === 201) {
            onSuccess && onSuccess();
        }
    } catch (error) {
        if (error?.response?.status === 409) {
            onAlreadyLiked?.(); // Already liked
        } else {
            onError?.(error);
        }
    }
}
