import { fonts, colors, STATUS_CONFIG } from "../styles/theme";
import { formatDate } from "../utils/dateHelpers";

export default function AppRow({ app, index, onEdit, onDelete }) {
  const cfg = STATUS_CONFIG[app.status];

  return (
    <div style={styles.row}>
      <div style={styles.index}>{String(index).padStart(3, "0")}</div>

      <div style={styles.main}>
        <div style={styles.top}>
          <span style={styles.company}>{app.company}</span>
          <span style={styles.sep}>—</span>
          <span style={styles.role}>{app.role}</span>
        </div>

        <div style={styles.meta}>
          {app.location && <span>{app.location}</span>}
          {app.salary   && <span>{app.salary}</span>}
          <span>{formatDate(app.date)}</span>
        </div>

        {app.notes && (
          <div style={styles.notes}>{app.notes}</div>
        )}
      </div>

      <div style={styles.right}>
        <span style={{ ...styles.badge, color: cfg.color, borderColor: cfg.color + "44" }}>
          {cfg.dot} {cfg.label}
        </span>
        <div style={styles.actions}>
          <button style={styles.actionBtn} onClick={() => onEdit(app)}>Edit</button>
          <button style={{ ...styles.actionBtn, color: colors.rejected }} onClick={() => onDelete(app.id)}>Delete</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  row: {
    display: "flex",
    gap: 20,
    padding: "18px 0",
    borderBottom: `1px solid ${colors.rule}`,
    alignItems: "flex-start",
  },
  index: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.ghost,
    paddingTop: 3,
    minWidth: 36,
  },
  main: { flex: 1, minWidth: 0 },
  top: {
    display: "flex",
    alignItems: "baseline",
    gap: 8,
    flexWrap: "wrap",
    marginBottom: 4,
  },
  company: {
    fontFamily: fonts.display,
    fontSize: 15,
    fontWeight: 700,
    color: colors.ink,
  },
  sep: {
    color: colors.ghost,
    fontFamily: fonts.body,
  },
  role: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.muted,
  },
  meta: {
    display: "flex",
    gap: 16,
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.muted,
    flexWrap: "wrap",
  },
  notes: {
    marginTop: 6,
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.muted,
    fontStyle: "italic",
    paddingLeft: 10,
    borderLeft: `2px solid ${colors.ghost}`,
  },
  right: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 8,
    minWidth: 110,
  },
  badge: {
    fontFamily: fonts.body,
    fontSize: 11,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    border: "1px solid",
    borderRadius: 2,
    padding: "3px 8px",
  },
  actions: { display: "flex", gap: 10 },
  actionBtn: {
    background: "none",
    border: "none",
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.muted,
    cursor: "pointer",
    padding: 0,
    textDecoration: "underline",
    textDecorationColor: colors.ghost,
  },
};
