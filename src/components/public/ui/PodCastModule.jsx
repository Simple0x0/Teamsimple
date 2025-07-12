import React, { useRef, useState, useEffect } from 'react';
import AudioProgressBar from './AudioProgressBar';
import { Link } from 'react-router-dom';
import { FaRegPauseCircle, FaRegPlayCircle } from "react-icons/fa";
import { FiFileText } from "react-icons/fi";
import { RiForward10Fill, RiReplay10Fill, RiVolumeUpLine, RiVolumeMuteLine } from "react-icons/ri";
import TranscriptModal from '../contents/PodcastRender/TranscriptModal';
import AuthorProfileModal from '../modals/AuthorProfileModal';

import style from '../../../app/Style';

export default function PodCastModule({ podcasts }) {
    const currentAudioRef = useRef(null);

    return (
        <div>
            {podcasts.map((podcast) => (
                <div key={podcast.PodcastID} className={style.podcastmodule.container}>
                    <img src={podcast.CoverImage} className={style.podcastmodule.image} alt="cover" />
                    <PodcastPlayer podcast={podcast} currentAudioRef={currentAudioRef} />
                </div>
            ))}
        </div>
    );
}

function PodcastPlayer({ podcast, currentAudioRef }) {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [totalTime, setTotalTime] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [activeUsername, setActiveUsername] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleOpenSummary = () => setIsModalOpen(true);
    const handleCloseSummary = () => setIsModalOpen(false);

    const togglePlay = () => {
        const audio = audioRef.current;
        if (currentAudioRef.current && currentAudioRef.current !== audio) {
            currentAudioRef.current.pause();
            currentAudioRef.current.currentTime = 0;
            currentAudioRef.current.dispatchEvent(new Event("ended"));
        }
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
            currentAudioRef.current = audio;
        }
        setIsPlaying(!isPlaying);
    };

    const skip = (seconds) => {
        audioRef.current.currentTime += seconds;
    };

    const toggleMute = () => {
        const audio = audioRef.current;
        audio.muted = !audio.muted;
        setIsMuted(audio.muted);
    };

    const toggleSpeed = () => {
        const nextSpeed = playbackRate >= 2 ? 1 : playbackRate + 0.5;
        audioRef.current.playbackRate = nextSpeed;
        setPlaybackRate(nextSpeed);
    };

    useEffect(() => {
        const audio = audioRef.current;

        const updateTime = () => setCurrentTime(audio.currentTime);
        const setDuration = () => setTotalTime(audio.duration || 0);
        const onEnd = () => {
            setCurrentTime(0);
            setIsPlaying(false);
        };

        const onPlay = () => setIsPlaying(true);
        const onPause = () => setIsPlaying(false);

        audio.addEventListener('timeupdate', updateTime);
        audio.addEventListener('loadedmetadata', setDuration);
        audio.addEventListener('ended', onEnd);
        audio.addEventListener('play', onPlay);
        audio.addEventListener('pause', onPause);

        return () => {
            audio.removeEventListener('timeupdate', updateTime);
            audio.removeEventListener('loadedmetadata', setDuration);
            audio.removeEventListener('ended', onEnd);
            audio.removeEventListener('play', onPlay);
            audio.removeEventListener('pause', onPause);
        };
    }, []);

    const [wasPlayingBeforeModal, setWasPlayingBeforeModal] = useState(false);

    useEffect(() => {
        if (isModalOpen) {
            if (isPlaying) {
                setWasPlayingBeforeModal(true); // track that it was playing
                audioRef.current.pause();
                setIsPlaying(false);
            }
        } else {
            if (wasPlayingBeforeModal) {
                audioRef.current.play();
                setIsPlaying(true);
                setWasPlayingBeforeModal(false); // reset
            }
        }
    }, [isModalOpen]);


    return (
        <div className={style.podcastmodule.elementsContainer}>
            <h2 className={style.podcastmodule.header}>
                Episode {podcast.EpisodeNumber}: {podcast.Title}
            </h2>

            <div className={style.podcastmodule.descriptionContainer}>
                <p className={style.podcastmodule.description}>{podcast.Description}</p>
                <FiFileText
                    className={style.podcastmodule.summaryIcon}
                    onClick={handleOpenSummary}
                />
            </div>

            <TranscriptModal
                isOpen={isModalOpen}
                onClose={handleCloseSummary}
                transcript={podcast.Content || "Transcript not available."}
                title={`Transcript for Episode ${podcast.EpisodeNumber} - ${podcast.Title}`}
            />

            <audio ref={audioRef} src={podcast.AudioURL} preload="metadata" />

            <div className={style.podcastmodule.allPlayContainer}>
                <div className={style.podcastmodule.playerRow}>
                    <div onClick={togglePlay} className={style.podcastmodule.playIcon}>
                        {isPlaying ? <FaRegPauseCircle /> : <FaRegPlayCircle />}
                    </div>

                    <div className={style.podcastmodule.audioControlsWrapper}>
                        <AudioProgressBar
                            currentTime={currentTime}
                            totalTime={totalTime}
                            onSeek={(time) => {
                                audioRef.current.currentTime = time;
                                setCurrentTime(time);
                            }}
                        />
                        <div className={style.podcastmodule.controls}>
                            <RiReplay10Fill
                                onClick={() => skip(-10)}
                                className={style.podcastmodule.controlIcon}
                            />
                            <RiForward10Fill
                                onClick={() => skip(10)}
                                className={style.podcastmodule.controlIcon}
                            />
                            <button
                                onClick={toggleSpeed}
                                className={style.podcastmodule.speedButton}
                            >
                                {playbackRate}x
                            </button>
                            {isMuted ? (
                                <RiVolumeMuteLine onClick={toggleMute} className={style.podcastmodule.controlIcon} />
                            ) : (
                                <RiVolumeUpLine onClick={toggleMute} className={style.podcastmodule.controlIcon} />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className={style.podcastmodule.metaContainer}>
                {/* Speaker Names as Modal Triggers */}
                <div className={style.podcastmodule.speakersContainer}>
                    <strong className={style.podcastmodule.speakerLabel}>
                        Speaker{podcast.ContributorNames.split(',').length > 1 ? 's' : ''}:
                    </strong>{' '}
                    {podcast.ContributorNames.split(',').map((name, index) => {
                        const username = podcast.ContributorNames?.split(',')[index]?.trim();
                        if (!username) return null;
                        return (
                            <span key={index}>
                                <button
                                    type="button"
                                    onClick={() => setActiveUsername(username)}
                                    className={`${style.podcastmodule.speakerLink} hover:cursor-pointer`}
                                >
                                    {name.trim()}
                                </button>
                                {index < podcast.ContributorNames.split(',').length - 1 ? ', ' : ''}
                            </span>
                        );
                    })}
                </div>

                {/* Author Modal */}
                {activeUsername && (
                    <AuthorProfileModal
                        isOpen={!!activeUsername}
                        onClose={() => setActiveUsername(null)}
                        username={activeUsername}
                    />
                )}

                {/* Published Date */}
                <div className={style.podcastmodule.datePublished}>
                    {new Date(podcast.DatePublished).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                    })}
                </div>
            </div>
        </div>
    );
}
