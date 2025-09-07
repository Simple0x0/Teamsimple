import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TbFaceIdError } from 'react-icons/tb';
import style from '../../../app/Style';

export default function ErrorHandle({ type = 'Content', errorType = 'public', message, rightbar = false, path = '/' }) {
  const navigate = useNavigate();

  const handleAction = () => {
    if (errorType === 'public') {
      navigate(path); 
    } else {
      navigate(0);
    }
  };

  const defaultMessage = {
    public: `${type} not found.`,
    server: `Something went wrong while loading the ${type.toLowerCase()}.`,
  };

  return (
    <div className={style.ErrorHandle.container}>
      <TbFaceIdError className={style.ErrorHandle.icon} />
      {!rightbar && <h1 className={style.ErrorHandle.heading}>Oops!</h1>}
      <p className={style.ErrorHandle.message}>{message || defaultMessage[errorType]}</p>
      {!rightbar && (
        <button onClick={handleAction} className={style.ErrorHandle.button}>
          {errorType === 'public' ? 'Go Home' : 'Refresh'}
        </button>
      )}
    </div>
  );
}
