import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvents } from '../redux/actions/eventActions';
import { fetchLatest } from '../redux/actions/latestActions';
import LatestModule from '../ui/LatestModule';
import RightSideBox from '../ui/RightSideBox';
import FooterModule from '../ui/FooterModule';

export default function RightSideBar() {
  const dispatch = useDispatch();
  const { events, loading: eventsLoading, error: eventsError } = useSelector((state) => state.events);
  const { latest, loading: latestLoading, error: latestError } = useSelector((state) => state.latest);

  useEffect(() => {
    if (!events.length) dispatch(fetchEvents());
    if (!latest.length) dispatch(fetchLatest());
  }, [dispatch]);

  // Normalize contents
  const formattedLatest = latest.map(item => ({
    image: item.Image,
    summary: item.Description,
    type: item.ContentType,
  }));

  const formattedEvents = events.map(item => ({
    image: item.EventImage,
    summary: item.Description,
    type: item.EventType,
  }));

  return (
    <div className="flex flex-col h-screen sticky top-0 w-full gap-1">
      <div className="flex flex-col grow gap-1">
        <RightSideBox
          title="Latest"
          contents={latestLoading ? [] : formattedLatest}
          loading={latestLoading}
          error={latestError}
        />
        <RightSideBox
          title="Events"
          contents={eventsLoading ? [] : formattedEvents}
          loading={eventsLoading}
          error={eventsError}
        />
      </div>

      <FooterModule />
    </div>
  );
}