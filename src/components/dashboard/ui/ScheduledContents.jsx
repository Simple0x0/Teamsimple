import React, { useState, useEffect } from "react";
import { FaCalendarAlt, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FaPodcast, FaBlog, FaFeatherAlt } from "react-icons/fa";
import { MdEvent } from "react-icons/md";
import style from "../../../app/Style";
import { fetchScheduledContents } from "../utils/apiRequest";
import { useNavigate } from "react-router-dom";

const iconMap = {
  Blog: <FaBlog className="text-lime-400 w-4 h-4 mr-2" />,
  Podcast: <FaPodcast className="text-lime-400 w-4 h-4 mr-2" />,
  Event: <MdEvent className="text-lime-400 w-4 h-4 mr-2" />,
  Writeup: <FaFeatherAlt className="text-lime-400 w-4 h-4 mr-2" />,
  Project: <FaFeatherAlt className="text-lime-400 w-4 h-4 mr-2" />,
};

const routeMap = {
  Blog: "/dashboard/blogs",
  Podcast: "/dashboard/podcasts",
  Event: "/dashboard/events",
  WriteUp: "/dashboard/writeups",
  Project: "/dashboard/projects",
};

export default function ScheduledContents() {
  const s = style.scheduledContents;
  const [scheduledData, setScheduledData] = useState([]);
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchScheduledContents()
      .then((data) => {
        // Expecting data.ScheduledContents or similar
        setScheduledData(data?.scheduled || []);
      })
      .catch(() => setScheduledData([]));
  }, []);

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + scheduledData.length) % scheduledData.length);
  };

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % scheduledData.length);
  };

  if (!scheduledData.length) {
    return (
      <div className={s.wrapper}>
        <div className={s.headerTitle}>
          <p className={s.title}>Scheduled</p>
        </div>
        <div className="text-center py-8 text-gray-400">No scheduled content.</div>
      </div>
    );
  }

  const current = scheduledData[index];
  // Format date as 'Aug 3, 2025, 2:30 PM' (or similar, locale-friendly)
  let formattedDate = "";
  if (current?.ScheduledDate) {
    const dateObj = new Date(current.ScheduledDate);
    formattedDate = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(dateObj);
  }
  const contentType = current.ContentType || current.type;
  const goToRoute = routeMap[contentType] || "/dashboard";

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
            {iconMap[contentType]}
            <p className={s.itemType}>{contentType}</p>
          </div>
          <p className={s.itemTitle}>{current.Title || current.title}</p>
          <p className={s.itemDate}>
            <FaCalendarAlt className="inline-block mr-1 text-gray-500" />
            {formattedDate}
          </p>

          <button className={s.publishBtn} onClick={() => navigate(goToRoute)}>
            Go to {contentType}
          </button>
        </div>
        <FaChevronRight className={s.navIcon} onClick={handleNext} />
      </div>
    </div>
  );
}
