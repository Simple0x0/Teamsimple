import React from 'react';
import style from '../../../app/Style';

export default function ErrorMessage({ message = "An unexpected error occurred." }) {
  return (
    <div className={style.error.container}>
      <p className={style.error.text}>{message}</p>
    </div>
  );
}
