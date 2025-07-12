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
        */}
      </div>
    </div>
  );
}
