import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import ContentContainer from './ContentContainer';
import style from '../../../app/Style';

export default function RightSideBox({ title, contents = [], loading, error, }) {
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalItems = contents.length;

  const goPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalItems) % totalItems);
  };

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalItems);
  };

  const currentItem = contents[currentIndex] || {};

  return (
    <div className={style.latestModule.mainContainer}>
      <div className={style.latestModule.titleContainer}>
        <h1 className={style.latestModule.title}>{title}</h1>
      </div>

      <ContentContainer loading={loading} error={error}>
        <div className={style.latestModule.centerContainer}>
          <FaChevronLeft className={style.latestModule.navIcon} onClick={goPrev} />

          <div className={style.latestModule.imageSummaryContainer}>
            <img
              src={currentItem.image}
              alt={currentItem.type}
              className={style.latestModule.image}
            />
            <p className={style.latestModule.Summary}>{currentItem.summary}</p>
          </div>

          <FaChevronRight className={style.latestModule.navIcon} onClick={goNext} />
        </div>
      </ContentContainer>
    </div>
  );
}
