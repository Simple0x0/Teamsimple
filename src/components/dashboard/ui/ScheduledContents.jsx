import React, { useState } from "react";
import { FaCalendarAlt, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FaPodcast, FaBlog, FaFeatherAlt } from "react-icons/fa";
import { MdEvent } from "react-icons/md";
import style from "../../../app/Style";

const scheduledData = [
  {
    id: 1,
    type: "Blog",
    title: "Understanding Supply Chain Attacks",
    scheduledFor: "2025-06-20 14:00",
  },
  {
    id: 2,
    type: "Podcast",
    title: "Deep Dive into AI Security",
    scheduledFor: "2025-06-22 17:30",
  },
  {
    id: 3,
    type: "Event",
    title: "Cybersec Africa Meetup",
    scheduledFor: "2025-07-01 10:00",
  },
  {
    id: 4,
    type: "Writeup",
    title: "CTF Challenge: Reversing Fun",
    scheduledFor: "2025-06-25 09:00",
  },
];

const iconMap = {
  Blog: <FaBlog className="text-lime-400 w-4 h-4 mr-2" />,
  Podcast: <FaPodcast className="text-lime-400 w-4 h-4 mr-2" />,
  Event: <MdEvent className="text-lime-400 w-4 h-4 mr-2" />,
  Writeup: <FaFeatherAlt className="text-lime-400 w-4 h-4 mr-2" />,
};

export default function ScheduledContents() {
  const s = style.scheduledContents;
  const [index, setIndex] = useState(0);

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + scheduledData.length) % scheduledData.length);
  };

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % scheduledData.length);
  };

  const current = scheduledData[index];

  return (
    <div className={s.wrapper}>
      {/* Centered Title */}
      <div className={s.headerTitle}>
        <p className={s.title}>Scheduled</p>
      </div>

      {/* Right-Aligned Count */}
      <div className={s.headerCount}>
        <span className={s.totalBadge}>{scheduledData.length} items</span>
      </div>

      {/* Navigation & Current Item */}
      <div className={s.navContainer}>
        <FaChevronLeft className={s.navIcon} onClick={handlePrev} />
        <div className={s.item}>
          <div className={s.itemHeader}>
            {iconMap[current.type]}
            <p className={s.itemType}>{current.type}</p>
          </div>
          <p className={s.itemTitle}>{current.title}</p>
          <p className={s.itemDate}>
            <FaCalendarAlt className="inline-block mr-1 text-gray-500" />
            {new Date(current.scheduledFor).toLocaleString()}
          </p>

          <button className={s.publishBtn}>Publish Now</button>
        </div>
        <FaChevronRight className={s.navIcon} onClick={handleNext} />
      </div>
    </div>
  );
}
