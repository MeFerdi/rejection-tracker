// ─────────────────────────────────────────────
// views/Dashboard.jsx
// ─────────────────────────────────────────────

import { fonts, colors, STATUS_CONFIG, GOAL } from "../styles/theme";
import ProgressBar from "../components/ProgressBar";
import StatCard    from "../components/StatCard";
import StatusPie   from "../charts/StatusPie";
import MonthlyBar  from "../charts/MonthlyBar";
import WeeklyStack from "../charts/WeeklyStack";
import { useStreak } from "../hooks/useStreak";

export default function Dashboard({ apps, stats }) {
  const streak = useStreak(apps);

  const sectionTitle = (text) => (
    <div style={styles.sectionTitle}>{text}</div>
  );

  return (
    <div style={styles.page}>
      <ProgressBar count={apps.length} />

      {/* Stat row */}
      <div style={styles.statGrid}>
        {Object.entries(STATUS_CONFIG).map(([status, cfg]) => (
          <StatCard
            key={status}
            label={status}
            value={stats[status] || 0}
            color={cfg.color}
          />
        ))}
        <StatCard
          label="Day Streak"
          value={streak}
          color={colors.muted}
          sub="consecutive days"
        />
      </div>

      {/* Charts row */}
      <div style={styles.chartGrid}>
        <div style={styles.card}>
          {sectionTitle("Status Breakdown")}
          <StatusPie stats={stats} />
        </div>
        <div style={styles.card}>
          {sectionTitle("Monthly Volume")}
          <MonthlyBar apps={apps} />
        </div>
      </div>

      {/* Weekly stack */}
      {apps.length > 0 && (
        <div style={{ ...styles.card, marginTop: 20 }}>
          {sectionTitle("Weekly Activity by Status")}
          <WeeklyStack apps={apps} />
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { padding: "32px 40px" },
  statGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: 16,
    marginBottom: 24,
  },
  chartGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 2fr",
    gap: 20,
  },
  card: {
    border: `1px solid ${colors.rule}`,
    borderRadius: 4,
    padding: "22px 24px",
    background: colors.paper,
  },
  sectionTitle: {
    fontFamily: fonts.body,
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    color: colors.muted,
    marginBottom: 16,
  },
};
