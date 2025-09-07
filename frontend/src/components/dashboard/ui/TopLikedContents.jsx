import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { TopLikes } from "../utils/apiRequest";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import ContentContainer from "../../public/ui/ContentContainer";
import style from "../../../app/Style";
import Loading from '../../public/ui/Loading';
import ErrorHandle from '../../public/ui/ErrorHandle';

export default function TopLikedContents() {
  const s = style.topLikedContents;

  const [toplikes, setToplikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchToplikes = async () => {
      try {
        const res = await TopLikes();
        setToplikes(res.toplikes || []);
        setError(false);
      } catch (err) {
        setToplikes([]);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchToplikes();
  }, []);

  const goPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + toplikes.length) % toplikes.length);
  };

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % toplikes.length);
  };

  const currentItem = toplikes[currentIndex];

  return (
    <div className={s.wrapper}>
      <p className={s.title}>Top Liked Contents</p>

      <ContentContainer loading={loading} error={error}>
        {loading ? (
          <Loading />
        ) : toplikes.length > 0 && currentItem ? (
          <div className={s.centerContainer}>
            <FaChevronLeft className={s.navIcon} onClick={goPrev} />

            <Link
              to={`/${currentItem.ContentType.toLowerCase()}/${currentItem.Slug}`}
              className={s.item}
            >
              <img
                src={currentItem.Image}
                alt={currentItem.Title}
                className={s.image}
              />
              <div className={s.content}>
                <p className={s.type}>{currentItem.ContentType}</p>
                <p className={s.name}>{currentItem.Title}</p>
                <p className={s.likes}>{currentItem.LikeCount} likes</p>
              </div>
            </Link>

            <FaChevronRight className={s.navIcon} onClick={goNext} />
          </div>
        ) : (
          <ErrorHandle type="Analytics" errorType="public" message='Top Liked Content not available' rightbar={true} />
        )}
      </ContentContainer>
    </div>
  );
}
