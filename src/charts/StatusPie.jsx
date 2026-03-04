// ─────────────────────────────────────────────
// charts/StatusPie.jsx
// ─────────────────────────────────────────────

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { fonts, colors, STATUS_CONFIG } from "../styles/theme";

export default function StatusPie({ stats }) {
  const data = Object.entries(STATUS_CONFIG)
    .map(([name, cfg]) => ({ name, value: stats[name] || 0, color: cfg.color }))
    .filter((d) => d.value > 0);

  if (!data.length) return (
    <div style={styles.empty}>No data yet</div>
  );

  return (
    <>
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={data}
            cx="50%" cy="50%"
            innerRadius={50} outerRadius={78}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: colors.paper,
              border: `1px solid ${colors.rule}`,
              borderRadius: 4,
              fontFamily: fonts.body,
              fontSize: 12,
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      <div style={styles.legend}>
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
          <div key={key} style={styles.legendItem}>
            <span style={{ ...styles.dot, background: cfg.color }} />
            <span style={styles.legendLabel}>{key}</span>
            <span style={styles.legendCount}>{stats[key] || 0}</span>
          </div>
        ))}
      </div>
    </>
  );
}

const styles = {
  empty: {
    height: 180,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.ghost,
  },
  legend: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    marginTop: 8,
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontFamily: fonts.body,
    fontSize: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    flexShrink: 0,
  },
  legendLabel: { flex: 1, color: colors.muted },
  legendCount: { color: colors.ink, fontWeight: 600 },
};
