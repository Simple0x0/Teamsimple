import React, { useEffect, useState } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import style from "../../../app/Style";
import { TVisitorsStats } from "../utils/apiRequest";
import Loading from "../../public/ui/Loading";
import ErrorHandle from "../../public/ui/ErrorHandle";

export default function VisitorsCount() {
  const s = style.visitorsCount;
  const [tvisitors, setTvisitors] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await TVisitorsStats();
        setTvisitors(res.TVisitors);
      } catch (error) {
        setTvisitors(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div className={s.wrapper}>
      <p className={s.title}>Total Visitors</p>

      {loading ? (
        <Loading />
      ) : tvisitors ? (
        <>
          <div className={s.badgeContainer}>
            <span
              className={`${s.badge} ${
                tvisitors.change >= 0 ? s.badgePositive : s.badgeNegative
              }`}
            >
              {tvisitors.change >= 0 ? (
                <ArrowUpRight className={s.icon} />
              ) : (
                <ArrowDownRight className={s.icon} />
              )}
              {tvisitors.change >= 0
                ? `+${tvisitors.change}%`
                : `${tvisitors.change}%`}
            </span>
          </div>

          <p className={s.total}>{tvisitors.total.toLocaleString()}</p>

          <p className={s.description}>
            Visitors {tvisitors.change >= 0 ? "grew" : "reduced"} by{" "}
            {Math.abs(tvisitors.change)}% this month
          </p>
        </>
      ) : (
        <ErrorHandle
          type="Visitor Analytics"
          errorType="public"
          message="Visitor data not available"
          rightbar={true}
        />
      )}
    </div>
  );
}
