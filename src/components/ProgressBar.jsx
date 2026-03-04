import { fonts, colors, GOAL } from "../styles/theme";

export default function ProgressBar({ count }) {
  const pct = Math.min((count / GOAL) * 100, 100);

  return (
    <div style={styles.wrap}>
      <div style={styles.header}>
        <span style={styles.label}>Mission Progress</span>
        <span style={styles.count}>
          <span style={styles.current}>{count}</span>
          <span style={styles.total}> / {GOAL}</span>
        </span>
      </div>

      <div style={styles.track}>
        <div style={{ ...styles.fill, width: `${pct}%` }} />
      </div>

      <div style={styles.footer}>
        <span>{pct.toFixed(1)}% complete</span>
        <span>{GOAL - count} remaining</span>
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    padding: "24px 32px",
    border: `1px solid ${colors.rule}`,
    borderRadius: 4,
    background: colors.paper,
    marginBottom: 24,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 12,
  },
  label: {
    fontFamily: fonts.body,
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    color: colors.muted,
  },
  count: { fontFamily: fonts.display },
  current: { fontSize: 28, fontWeight: 700, color: colors.ink },
  total: { fontSize: 16, color: colors.muted },
  track: {
    background: colors.offwhite,
    borderRadius: 2,
    height: 6,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    background: colors.ink,
    borderRadius: 2,
    transition: "width 0.6s ease",
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 8,
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.muted,
    letterSpacing: "0.04em",
  },
};
