// ─────────────────────────────────────────────
// charts/MonthlyBar.jsx
// ─────────────────────────────────────────────

import { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import { fonts, colors } from "../styles/theme";
import { getMonthKey, MONTH_ORDER } from "../utils/dateHelpers";

export default function MonthlyBar({ apps }) {
  const data = useMemo(() => {
    const map = {};
    apps.forEach((a) => {
      const k = getMonthKey(a.date);
      map[k] = (map[k] || 0) + 1;
    });
    return MONTH_ORDER
      .filter((m) => map[m])
      .map((m) => ({ month: m, total: map[m] }));
  }, [apps]);

  if (!data.length) return (
    <div style={styles.empty}>Add applications to see monthly trends</div>
  );

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={colors.rule} vertical={false} />
        <XAxis
          dataKey="month"
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
        <Bar dataKey="total" fill={colors.ink} radius={[2, 2, 0, 0]} maxBarSize={40} />
      </BarChart>
    </ResponsiveContainer>
  );
}

const styles = {
  empty: {
    height: 220,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.ghost,
  },
};
