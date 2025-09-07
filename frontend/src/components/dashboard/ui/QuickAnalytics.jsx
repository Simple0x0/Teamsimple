import React, { useEffect, useState } from 'react';
import style from "../../../app/Style";
import { getQuickanalytics } from '../utils/apiRequest';
import Loading from '../../public/ui/Loading';
import ErrorHandle from '../../public/ui/ErrorHandle';

export default function QuickAnalytics() {
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await getQuickanalytics();
        setAnalytics(res.quickanalytics);
      } catch (error) {
        setAnalytics([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);
  
  const s = style.quickAnalytics;
  return (
    <div className={s.wrapper}>
      <p className={s.title}>Quick Analytics</p>
      <div className={s.grid}>
        {loading ? (
          <Loading />
        ) : analytics?.length > 0 ? (
          analytics.map((item, index) => (
            <div key={index} className={s.item}>
              <div className={s.labelRow}>
                <span className={s.value}>{item.Total}</span>
                <span className={s.label}>{item.Label}</span>
              </div>
              <p className={s.subValue}>{item.Likes} likes</p>
            </div>
          ))
        ) : (
          <ErrorHandle type="Analytics" errorType="public" message='Analytics not available' rightbar={true} />
        )}
      </div>
    </div>
  );
}
