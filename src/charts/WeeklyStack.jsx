// ─────────────────────────────────────────────
// charts/WeeklyStack.jsx
// ─────────────────────────────────────────────

import { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { fonts, colors, STATUS_CONFIG } from "../styles/theme";
import { getWeekKey } from "../utils/dateHelpers";

export default function WeeklyStack({ apps }) {
  const data = useMemo(() => {
    const map = {};
    apps.forEach((a) => {
      const k = getWeekKey(a.date);
      if (!map[k]) map[k] = { week: k, Applied: 0, Interview: 0, Rejected: 0, Offer: 0 };
      map[k][a.status]++;
    });
    return Object.values(map).slice(-10);
  }, [apps]);

  if (!data.length) return null;

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={colors.rule} vertical={false} />
        <XAxis
          dataKey="week"
          tick={{ fill: colors.muted, fontSize: 11, fontFamily: fonts.body }}
          axisLine={false} tickLine={false}
        />
        <YAxis
          tick={{ fill: colors.muted, fontSize: 11, fontFamily: fonts.body }}
          axisLine={false} tickLine={false}
        />
        <Tooltip
          contentStyle={{
            background: colors.paper,
            border: `1px solid ${colors.rule}`,
            borderRadius: 4,
            fontFamily: fonts.body,
            fontSize: 12,
          }}
          cursor={{ fill: colors.offwhite }}
        />
        <Legend
          wrapperStyle={{ fontFamily: fonts.body, fontSize: 11, color: colors.muted }}
        />
        {Object.entries(STATUS_CONFIG).map(([status, cfg]) => (
          <Bar key={status} dataKey={status} stackId="a" fill={cfg.color} maxBarSize={40} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
