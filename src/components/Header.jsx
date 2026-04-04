import { fonts, colors } from "../styles/theme";
import { exportToCSV } from "../utils/exportCSV";

export default function Header({ view, setView, apps, onImport }) {
  const NAV = [
    { key: "dashboard", label: "Overview" },
    { key: "board",     label: "Board"    },
    { key: "log",       label: "Log"      },
    { key: "add",       label: "Add"      },
  ];

  return (
    <header style={styles.header}>
      <div style={styles.brand}>
        <span style={styles.brandMark}>✕</span>
        <div>
          <div style={styles.brandTitle}>1000 Challenge</div>
          <div style={styles.brandSub}>2026 · Job Hunt Tracker</div>
        </div>
      </div>

      <nav style={styles.nav}>
        {NAV.map(({ key, label }) => (
          <button
            key={key}
            style={view === key ? styles.navActive : styles.navItem}
            onClick={() => setView(key)}
          >
            {label}
          </button>
        ))}
      </nav>

      <div style={styles.actions}>
        {/* Import — always visible so you can sync on a fresh device */}
        <button style={styles.importBtn} onClick={onImport} title="Import CSV from another device">
          ↑ Import
        </button>

        {apps.length > 0 && (
          <button style={styles.exportBtn} onClick={() => exportToCSV(apps)} title="Export to CSV">
            ↓ Export
          </button>
        )}
      </div>
    </header>
  );
}

const styles = {
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "20px 40px",
    borderBottom: `1px solid ${colors.rule}`,
    background: colors.paper,
    flexWrap: "wrap",
    gap: 16,
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: 14,
  },
  brandMark: {
    fontFamily: fonts.display,
    fontSize: 28,
    color: colors.rejected,
    lineHeight: 1,
    fontWeight: 900,
  },
  brandTitle: {
    fontFamily: fonts.display,
    fontSize: 18,
    fontWeight: 700,
    color: colors.ink,
    letterSpacing: "-0.3px",
  },
  brandSub: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.muted,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    marginTop: 1,
  },
  nav: {
    display: "flex",
    gap: 0,
    border: `1px solid ${colors.rule}`,
    borderRadius: 6,
    overflow: "hidden",
  },
  navItem: {
    padding: "8px 20px",
    background: "transparent",
    border: "none",
    borderRight: `1px solid ${colors.rule}`,
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.muted,
    cursor: "pointer",
  },
  navActive: {
    padding: "8px 20px",
    background: colors.ink,
    border: "none",
    borderRight: `1px solid ${colors.rule}`,
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.paper,
    cursor: "pointer",
    fontWeight: 600,
  },
  actions: {
    display: "flex",
    gap: 8,
    alignItems: "center",
  },
  importBtn: {
    padding: "8px 16px",
    background: "transparent",
    border: `1px solid ${colors.rule}`,
    borderRadius: 6,
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.muted,
    cursor: "pointer",
  },
  exportBtn: {
    padding: "8px 16px",
    background: "transparent",
    border: `1px solid ${colors.ink}`,
    borderRadius: 6,
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.ink,
    cursor: "pointer",
    letterSpacing: "0.02em",
  },
};