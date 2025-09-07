import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import style from '../../../app/Style';

export default function MessageToast({
  message = '',
  duration = 4000,
  redirect = '',
  onClose = () => {},
  type = 'success',
}) {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(100);
  const [paused, setPaused] = useState(false);
  const navigate = useNavigate();

  const intervalRef = useRef(null);
  const lastTimeRef = useRef(Date.now());

  useEffect(() => {
    if (!visible) return;

    const intervalMs = 100;
    const step = (100 * intervalMs) / duration;

    intervalRef.current = setInterval(() => {
      if (!paused) {
        const now = Date.now();
        const delta = now - lastTimeRef.current;
        lastTimeRef.current = now;

        setProgress(prev => {
          const decrement = (delta / duration) * 100;
          return Math.max(prev - decrement, 0);
        });
      }
    }, intervalMs);

    return () => clearInterval(intervalRef.current);
  }, [duration, paused, visible]);

  useEffect(() => {
    if (progress <= 0 && visible) {
      setVisible(false);
      onClose();
      if (redirect) navigate(redirect, { state: { reload: true } });
    }
  }, [progress, visible, onClose, redirect, navigate]);

  const s = style.toast[type] || style.toast['success'];

  return visible ? (
    <div
      className={s.wrapper}
      role="alert"
      aria-live="assertive"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => {
        setPaused(false);
        lastTimeRef.current = Date.now();
      }}
    >
      <p className={s.message}>{message}</p>
      <div className={s.progressContainer}>
        <div className={s.progressBar} style={{ width: `${progress}%` }} />
      </div>
    </div>
  ) : null;
}
