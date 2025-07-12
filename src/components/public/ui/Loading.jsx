import React from 'react';
import style from '../../../app/Style';

export default function Loading() {
  return (
    <div className={style.loading.container}>
      <div className={style.loading.spinner} role="status">
        <span className={style.loading.srOnly}>Loading...</span>
      </div>
    </div>
  );
}
