import { fonts, colors } from "../styles/theme";

export default function StatCard({ label, value, color, sub }) {
  return (
    <div style={{ ...styles.card, borderTop: `3px solid ${color}` }}>
      <div style={{ ...styles.value, color }}>{value}</div>
      <div style={styles.label}>{label}</div>
      {sub && <div style={styles.sub}>{sub}</div>}
    </div>
  );
}

const styles = {
  card: {
    background: colors.paper,
    border: `1px solid ${colors.rule}`,
    borderRadius: 4,
    padding: "22px 20px 18px",
  },
  value: {
    fontFamily: fonts.display,
    fontSize: 40,
    fontWeight: 700,
    lineHeight: 1,
    marginBottom: 6,
  },
  label: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.muted,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
  },
  sub: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.muted,
    marginTop: 4,
  },
};
