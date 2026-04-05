import { useMemo } from "react";
import { fonts, colors, STATUS_CONFIG, CATEGORY_CONFIG, GOAL } from "../styles/theme";
import ProgressBar from "../components/ProgressBar";
import StatCard    from "../components/StatCard";
import StatusPie   from "../charts/StatusPie";
import MonthlyBar  from "../charts/MonthlyBar";
import WeeklyStack from "../charts/WeeklyStack";
import { useStreak } from "../hooks/useStreak";
import { computeAnalytics } from "../utils/analytics";

export default function Dashboard({ apps, stats }) {
  const streak = useStreak(apps);
  const analytics = useMemo(() => computeAnalytics(apps), [apps]);
  const categoryStats = useMemo(() => {
    const counts = Object.keys(CATEGORY_CONFIG).reduce((acc, category) => {
      acc[category] = 0;
      return acc;
    }, {});

    apps.forEach((app) => {
      const category = CATEGORY_CONFIG[app.category] ? app.category : "Job";
      counts[category] = (counts[category] || 0) + 1;
    });

    return counts;
  }, [apps]);

  const sectionTitle = (text) => (
    <div style={styles.sectionTitle}>{text}</div>
  );

  return (
    <div className="page-pad" style={styles.page}>
      <ProgressBar count={apps.length} />

      {/* Stat row */}
      <div className="dashboard-grid" style={styles.statGrid}>
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

      <div className="dashboard-grid-secondary" style={styles.statGridSecondary}>
        <StatCard label="Active Pipeline" value={analytics.activePipeline} color={colors.job} sub="applied + interview" />
        <StatCard label="Interview Rate" value={`${analytics.interviewRate}%`} color={colors.interview} sub="of total applications" />
        <StatCard label="Offer Rate" value={`${analytics.offerRate}%`} color={colors.offer} sub="of total applications" />
        <StatCard label="Avg Decision Time" value={`${analytics.avgDecisionDays}d`} color={colors.scholarship} sub="applied → final" />
        <StatCard label="Overdue Follow-ups" value={analytics.overdueFollowUps} color={colors.rejected} sub="needs attention" />
      </div>

      <div className="dashboard-card" style={{ ...styles.card, marginBottom: 20 }}>
        {sectionTitle("Applications by Category")}
        <div className="dashboard-category-grid" style={styles.categoryGrid}>
          {Object.entries(CATEGORY_CONFIG).map(([category, cfg]) => (
            <div key={category} style={styles.categoryCard}>
              <div style={styles.categoryHead}>
                <span style={{ ...styles.categoryDot, background: cfg.color }} />
                <span style={styles.categoryLabel}>{category}</span>
              </div>
              <div style={{ ...styles.categoryCount, color: cfg.color }}>
                {categoryStats[category] || 0}
              </div>
            </div>
        ))}
        </div>
      </div>

      {/* Charts row */}
      <div style={styles.chartGrid}>
        <div className="dashboard-card" style={styles.card}>
          {sectionTitle("Status Breakdown")}
          <StatusPie stats={stats} />
        </div>
        <div className="dashboard-card" style={styles.card}>
          {sectionTitle("Monthly Volume")}
          <MonthlyBar apps={apps} />
        </div>
      </div>

      {/* Weekly stack */}
      {apps.length > 0 && (
        <div className="dashboard-card" style={{ ...styles.card, marginTop: 20 }}>
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
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: 16,
    marginBottom: 24,
  },
  statGridSecondary: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: 16,
    marginBottom: 24,
  },
  chartGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 20,
  },
  categoryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: 12,
  },
  categoryCard: {
    border: `1px solid ${colors.rule}`,
    borderRadius: 8,
    padding: "14px 16px",
    background: colors.offwhite,
  },
  categoryHead: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
  },
  categoryDot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    flexShrink: 0,
  },
  categoryLabel: {
    fontFamily: fonts.body,
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: colors.muted,
  },
  categoryCount: {
    fontFamily: fonts.display,
    fontSize: 30,
    fontWeight: 700,
    lineHeight: 1,
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
