import React, { useRef, useState, useEffect } from 'react';
import style from '../../../app/Style';

export default function AudioProgressBar({ currentTime, totalTime, onSeek }) {
  const progressRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragTime, setDragTime] = useState(currentTime);
  const progressPercent = ((isDragging ? dragTime : currentTime) / totalTime) * 100 || 0;

  const calculateTimeFromPosition = (clientX) => {
    const rect = progressRef.current.getBoundingClientRect();
    const offsetX = clientX - rect.left;
    const percent = Math.min(Math.max(offsetX / rect.width, 0), 1);
    return percent * totalTime;
  };

  const handleMouseDown = (e) => {
    const newTime = calculateTimeFromPosition(e.clientX);
    setDragTime(newTime);
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const newTime = calculateTimeFromPosition(e.clientX);
    setDragTime(newTime);
  };

  const handleMouseUp = (e) => {
    if (!isDragging) return;
    const newTime = calculateTimeFromPosition(e.clientX);
    setIsDragging(false);
    onSeek && onSeek(newTime);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div className={style.audioProgressBar.container}>
      {/* Time Labels */}
      <div className={style.audioProgressBar.timeLabels}>
        <span>{formatTime(isDragging ? dragTime : currentTime)}</span>
        <span>{formatTime(totalTime)}</span>
      </div>

      {/* Progress bar with drag support */}
      <div
        ref={progressRef}
        onMouseDown={handleMouseDown}
        className={style.audioProgressBar.progressWrapper}
      >
        <div
          className={style.audioProgressBar.progressFill}
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}

// Format MM:SS
function formatTime(timeInSeconds) {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}
