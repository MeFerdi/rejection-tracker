import { fonts, colors, STATUS_CONFIG, CATEGORY_CONFIG, PRIORITY_CONFIG } from "../styles/theme";
import { formatDate } from "../utils/dateHelpers";

export default function AppRow({ app, index, onEdit, onDelete }) {
  const cfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.Applied;
  const categoryCfg = CATEGORY_CONFIG[app.category] || CATEGORY_CONFIG.Job;
  const priorityCfg = PRIORITY_CONFIG[app.priority] || PRIORITY_CONFIG.Medium;
  const history = Array.isArray(app.statusHistory) && app.statusHistory.length
    ? app.statusHistory
    : [{ status: app.status, date: app.date }];
  const isFollowUpDue = app.followUpDate && new Date(app.followUpDate) <= new Date();

  return (
    <div style={styles.row}>
      <div style={styles.index}>{String(index).padStart(3, "0")}</div>

      <div style={styles.main}>
        <div style={styles.top}>
          <span style={styles.company}>{app.company}</span>
          <span style={styles.sep}>—</span>
          <span style={styles.role}>{app.role}</span>
        </div>

        <div style={styles.chips}>
          <span style={{ ...styles.categoryChip, color: categoryCfg.color, borderColor: categoryCfg.color + "4D" }}>
            {categoryCfg.label}
          </span>
          <span style={{ ...styles.priorityChip, color: priorityCfg.color, borderColor: priorityCfg.color + "4D" }}>
            {priorityCfg.label} priority
          </span>
          <span style={{ ...styles.statusChip, color: cfg.color, borderColor: cfg.color + "4D" }}>
            {cfg.label}
          </span>
          {app.followUpDate && (
            <span style={{ ...styles.followUpChip, color: isFollowUpDue ? colors.rejected : colors.muted, borderColor: (isFollowUpDue ? colors.rejected : colors.mid) + "66" }}>
              {isFollowUpDue ? "Follow-up due" : "Follow-up"} · {formatDate(app.followUpDate)}
            </span>
          )}
        </div>

        <div style={styles.meta}>
          {app.location && <span>{app.location}</span>}
          {app.salary   && <span>{app.salary}</span>}
          <span>{formatDate(app.date)}</span>
        </div>

        <div style={styles.timelineWrap}>
          <span style={styles.progressLabel}>Progress</span>
          <div style={styles.timeline}>
            {history.map((step, i) => {
              const stepCfg = STATUS_CONFIG[step.status] || STATUS_CONFIG.Applied;
              return (
                <div key={`${step.status}-${step.date}-${i}`} style={styles.timelineStep}>
                  <div style={{ ...styles.timelineDot, background: stepCfg.color }} />
                  <div style={styles.timelineTextWrap}>
                    <span style={{ ...styles.timelineStatus, color: stepCfg.color }}>{step.status}</span>
                    <span style={styles.timelineDate}>{formatDate(step.date)}</span>
                  </div>
                  {i < history.length - 1 && <div style={styles.timelineConnector} />}
                </div>
              );
            })}
          </div>
        </div>

        {app.notes && (
          <div style={styles.notes}>{app.notes}</div>
        )}
      </div>

      <div style={styles.right}>
        <span style={{ ...styles.categoryBadge, color: categoryCfg.color, borderColor: categoryCfg.color + "44" }}>
          {categoryCfg.label}
        </span>
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
  chips: {
    display: "flex",
    gap: 8,
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  categoryChip: {
    display: "inline-flex",
    alignItems: "center",
    padding: "4px 9px",
    border: "1px solid",
    borderRadius: 999,
    fontFamily: fonts.body,
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    background: colors.paper,
  },
  statusChip: {
    display: "inline-flex",
    alignItems: "center",
    padding: "4px 9px",
    border: "1px solid",
    borderRadius: 999,
    fontFamily: fonts.body,
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    background: colors.paper,
  },
  priorityChip: {
    display: "inline-flex",
    alignItems: "center",
    padding: "4px 9px",
    border: "1px solid",
    borderRadius: 999,
    fontFamily: fonts.body,
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    background: colors.paper,
  },
  followUpChip: {
    display: "inline-flex",
    alignItems: "center",
    padding: "4px 9px",
    border: "1px solid",
    borderRadius: 999,
    fontFamily: fonts.body,
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    background: colors.paper,
  },
  meta: {
    display: "flex",
    gap: 16,
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.muted,
    flexWrap: "wrap",
  },
  timelineWrap: {
    marginTop: 10,
  },
  timeline: {
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
    marginTop: 8,
    flexWrap: "wrap",
  },
  timelineStep: {
    display: "flex",
    alignItems: "flex-start",
    gap: 8,
    position: "relative",
    paddingRight: 4,
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    marginTop: 4,
    boxShadow: `0 0 0 4px ${colors.offwhite}`,
    flexShrink: 0,
  },
  timelineTextWrap: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  timelineStatus: {
    fontFamily: fonts.body,
    fontSize: 12,
    fontWeight: 600,
    lineHeight: 1.2,
  },
  timelineDate: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: colors.muted,
  },
  timelineConnector: {
    width: 24,
    height: 1,
    background: colors.rule,
    marginTop: 9,
    marginLeft: 4,
    marginRight: 2,
  },
  progress: {
    display: "flex",
    gap: 8,
    marginTop: 8,
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.muted,
    flexWrap: "wrap",
  },
  progressLabel: {
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: colors.ghost,
  },
  progressText: {
    color: colors.ink,
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
  categoryBadge: {
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
