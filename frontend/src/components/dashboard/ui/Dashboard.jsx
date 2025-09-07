import React, { useState, useEffect } from 'react';
import { useDashboardUser } from '../context/DashboardUserContext';
import { useLocation, useNavigate } from 'react-router-dom';
import Loading from '../../public/ui/Loading';
import VisitorLikesChart from './VisitorLikesChart';
import ActionButtons from "./ActionButtons";
import style from "../../../app/Style"; 
import QuickAnalytics from "./QuickAnalytics";
import VisitorsCount from "./VisitorsCount";
import TopLikedContents from "./TopLikedContents";
import ScheduledContents from "./ScheduledContents";
import MessageToast from '../ui/MessageToast';

export default function DashboardStats() {
  const { member, loading } = useDashboardUser();
  const location = useLocation();
  const navigate = useNavigate();
  const [toastConfig, setToastConfig] = useState({
    message: '',
    duration: 3000,
    visible: false,
    type: 'success',
    redirect: '',
  });

  useEffect(() => {
    // Check for toast passed via location.state
    if (location.state?.toast) {
      const { message, duration = 6000, type = 'success', redirect = '' } = location.state.toast;
      setToastConfig({ message, duration, type, redirect, visible: true });

      setTimeout(() => {
        setToastConfig(prev => ({ ...prev, visible: false }));
        if (redirect) navigate(redirect);
      }, duration);

      // Clean up state after toast to avoid re-rendering
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location]);

  if (loading) return <Loading />;

  return (
    <>
      {toastConfig.visible && (
        <MessageToast
          message={toastConfig.message}
          duration={toastConfig.duration}
          type={toastConfig.type}
          redirect={toastConfig.redirect}
          onClose={() => setToastConfig(prev => ({ ...prev, visible: false }))}
        />
      )}
      <div className={style.dashboardStatsContainer.sectionLayout}>
        <div className={style.dashboardStatsContainer.topRow}>
          <div className={style.dashboardStatsContainer.chartActionWrapper}>
            <VisitorLikesChart />
            <ActionButtons />
          </div>
        </div>
        <div className={style.dashboardStatsContainer.bottomGrid}>
          <QuickAnalytics />
          <VisitorsCount />
          <TopLikedContents />
          <ScheduledContents />
        </div>
      </div>
    </>
  );
}




/*
import React from 'react';
import { useDashboardUser } from '../context/DashboardUserContext';
import Loading from '../../public/ui/Loading';
import VisitorLikesChart from './VisitorLikesChart';
import ActionButtons from "./ActionButtons";
import style from "../../../app/Style"; 
import QuickAnalytics from "./QuickAnalytics";
import VisitorsCount from "./VisitorsCount";
import TopLikedContents from "./TopLikedContents";
import ScheduledContents from "./ScheduledContents";

export default function DashboardStats() {
  const { member, loading } = useDashboardUser();

  if (loading) return <Loading />;

  return (
    <div className={style.dashboardStatsContainer.sectionLayout}>
      <div className={style.dashboardStatsContainer.topRow}>
        <div className={style.dashboardStatsContainer.chartActionWrapper}>
          <VisitorLikesChart />
          <ActionButtons />
        </div>
      </div>
      <div className={style.dashboardStatsContainer.bottomGrid}>
        <QuickAnalytics />
        <VisitorsCount />
        <TopLikedContents />
        <ScheduledContents />
        {/*
        COMPONENTS NOT YET IMPLMENTED - RESERVERED FOR LATER
        <UpcomingEvents />
        <TeamActivityLog />
        *}
      </div>
    </div>
  );
}
*/