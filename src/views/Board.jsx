import { useMemo } from "react";
import { fonts, colors, STATUS_CONFIG, CATEGORY_CONFIG, PRIORITY_CONFIG } from "../styles/theme";
import { formatDate } from "../utils/dateHelpers";

const BOARD_STATUSES = ["Applied", "Interview", "Offer", "Rejected"];

export default function Board({ apps, onEdit, onDelete }) {
  const grouped = useMemo(() => {
    const groups = Object.fromEntries(BOARD_STATUSES.map((status) => [status, []]));
    apps.forEach((app) => {
      const status = STATUS_CONFIG[app.status] ? app.status : "Applied";
      groups[status].push(app);
    });
    BOARD_STATUSES.forEach((status) => {
      groups[status].sort((a, b) => new Date(b.updatedAt || b.statusDate || b.date) - new Date(a.updatedAt || a.statusDate || a.date));
    });
    return groups;
  }, [apps]);

  return (
    <div style={styles.page}>
      <div style={styles.toolbar}>
        <div style={styles.title}>Pipeline Board</div>
        <div style={styles.subtitle}>Track each application as it moves through the funnel.</div>
      </div>

      <div style={styles.board}>
        {BOARD_STATUSES.map((status) => {
          const cfg = STATUS_CONFIG[status];
          const items = grouped[status] || [];
          return (
            <section key={status} style={styles.column}>
              <header style={styles.columnHeader}>
                <div style={styles.columnTitleWrap}>
                  <span style={{ ...styles.columnDot, background: cfg.color }} />
                  <span style={styles.columnTitle}>{cfg.label}</span>
                </div>
                <span style={{ ...styles.columnCount, color: cfg.color }}>{items.length}</span>
              </header>

              <div style={styles.cardList}>
                {items.length === 0 ? (
                  <div style={styles.empty}>No applications here yet.</div>
                ) : items.map((app) => {
                  const categoryCfg = CATEGORY_CONFIG[app.category] || CATEGORY_CONFIG.Job;
                  const priorityCfg = PRIORITY_CONFIG[app.priority] || PRIORITY_CONFIG.Medium;
                  const isDue = app.followUpDate && new Date(app.followUpDate) <= new Date();
                  return (
                    <article key={app.id} style={styles.card}>
                      <div style={styles.cardTop}>
                        <div>
                          <div style={styles.company}>{app.company}</div>
                          <div style={styles.role}>{app.role}</div>
                        </div>
                        <span style={{ ...styles.statusBadge, color: cfg.color, borderColor: cfg.color + "55" }}>{cfg.label}</span>
                      </div>

                      <div style={styles.chips}>
                        <span style={{ ...styles.chip, color: categoryCfg.color, borderColor: categoryCfg.color + "55" }}>{categoryCfg.label}</span>
                        <span style={{ ...styles.chip, color: priorityCfg.color, borderColor: priorityCfg.color + "55" }}>{priorityCfg.label}</span>
                        {app.followUpDate && (
                          <span style={{ ...styles.chip, color: isDue ? colors.rejected : colors.muted, borderColor: (isDue ? colors.rejected : colors.mid) + "55" }}>
                            {isDue ? "Follow-up due" : "Follow-up"} · {formatDate(app.followUpDate)}
                          </span>
                        )}
                      </div>

                      <div style={styles.meta}>
                        {app.location && <span>{app.location}</span>}
                        {app.date && <span>Applied {formatDate(app.date)}</span>}
                      </div>

                      <div style={styles.actions}>
                        <button style={styles.action} onClick={() => onEdit(app)}>Edit</button>
                        <button style={{ ...styles.action, color: colors.rejected }} onClick={() => onDelete(app.id)}>Delete</button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: "28px 32px 36px",
  },
  toolbar: {
    marginBottom: 20,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 24,
    fontWeight: 700,
    color: colors.ink,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.muted,
    marginTop: 4,
  },
  board: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: 16,
    alignItems: "start",
  },
  column: {
    border: `1px solid ${colors.rule}`,
    borderRadius: 8,
    background: colors.paper,
    minHeight: 380,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  columnHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 14px 12px",
    borderBottom: `1px solid ${colors.rule}`,
    background: colors.offwhite,
  },
  columnTitleWrap: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  columnDot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
  },
  columnTitle: {
    fontFamily: fonts.body,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: colors.ink,
    fontWeight: 600,
  },
  columnCount: {
    fontFamily: fonts.mono,
    fontSize: 12,
  },
  cardList: {
    padding: 12,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  card: {
    border: `1px solid ${colors.rule}`,
    borderRadius: 8,
    padding: 14,
    background: colors.paper,
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 10,
  },
  company: {
    fontFamily: fonts.display,
    fontSize: 16,
    fontWeight: 700,
    color: colors.ink,
  },
  role: {
    marginTop: 2,
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.muted,
  },
  statusBadge: {
    padding: "4px 8px",
    borderRadius: 999,
    border: "1px solid",
    fontFamily: fonts.body,
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    whiteSpace: "nowrap",
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 12,
  },
  chip: {
    padding: "4px 8px",
    borderRadius: 999,
    border: "1px solid",
    fontFamily: fonts.body,
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    background: colors.paper,
  },
  meta: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    marginTop: 12,
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.muted,
  },
  actions: {
    display: "flex",
    gap: 12,
    marginTop: 12,
  },
  action: {
    background: "none",
    border: "none",
    padding: 0,
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.muted,
    textDecoration: "underline",
    cursor: "pointer",
  },
  empty: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.ghost,
    fontStyle: "italic",
    padding: "8px 4px",
  },
};
