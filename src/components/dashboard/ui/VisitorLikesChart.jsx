import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import style from '../../../app/Style';
import { VisitorLikeStats } from '../utils/apiRequest';
import Loading from '../../public/ui/Loading';
import ErrorHandle from '../../public/ui/ErrorHandle';

export default function VisitorLikesChart() {
  const s = style.DashboardChartStyle;

  const [timeline, setTimeline] = useState('week');
  const [visitorslikes, setVisitorslikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchVisitorslikes = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await VisitorLikeStats({ timeline });
      setVisitorslikes(res.stats || []);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError(true);
      setVisitorslikes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitorslikes();
  }, [timeline]);

  return (
    <div className={s.wrapper}>
      {/* Timeline Selector */}
      <div className={s.selectorWrapper}>
        {["week", "month", "year"].map((t) => (
          <button
            key={t}
            onClick={() => setTimeline(t)}
            className={`${s.selectorBtn} ${timeline === t ? s.activeSelector : s.inactiveSelector}`}
          >
            {t}
          </button>
        ))}
      </div>

      <h2 className={s.title}>Visitors & Likes Overview</h2>

      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorHandle message="Failed to load visitor/like stats." errorType="public" rightbar={true} />
      ) : (
        <div className={s.chartArea}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={visitorslikes}>
              <CartesianGrid strokeDasharray="4 4" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{ backgroundColor: "#1f2937", border: "none", color: "#fff" }}
                labelStyle={{ color: "#9ca3af" }}
              />
              <Line
                type="monotone"
                dataKey="visitors"
                stroke="#84cc16"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="likes"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
