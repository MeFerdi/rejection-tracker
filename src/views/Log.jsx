import { useState, useMemo } from "react";
import { fonts, colors, STATUS_CONFIG, CATEGORY_CONFIG } from "../styles/theme";
import AppRow from "../components/AppRow";

export default function Log({ apps, onEdit, onDelete }) {
  const [search, setSearch]           = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterCategory, setFilterCategory] = useState("All");

  const filtered = useMemo(() => {
    return apps
      .filter((a) => filterStatus === "All" || a.status === filterStatus)
      .filter((a) => filterCategory === "All" || a.category === filterCategory)
      .filter((a) =>
        a.company.toLowerCase().includes(search.toLowerCase()) ||
        a.role.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => new Date(b.updatedAt || b.statusDate || b.date) - new Date(a.updatedAt || a.statusDate || a.date));
  }, [apps, search, filterStatus, filterCategory]);

  return (
    <div className="page-pad" style={styles.page}>
      {/* Toolbar */}
      <div className="log-toolbar" style={styles.toolbar}>
        <input
          className="log-search"
          style={styles.search}
          placeholder="Search company or role…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search applications by company or role"
        />
        <div className="log-filter-group" style={styles.filterGroup}>
          <div style={styles.filters}>
            {["All", ...Object.keys(STATUS_CONFIG)].map((s) => (
              <button
                key={s}
                type="button"
                style={filterStatus === s ? styles.filterActive : styles.filter}
                onClick={() => setFilterStatus(s)}
                aria-pressed={filterStatus === s}
              >
                {s}
              </button>
            ))}
          </div>
          <div style={styles.filters}>
            {["All", ...Object.keys(CATEGORY_CONFIG)].map((s) => (
              <button
                key={s}
                type="button"
                style={filterCategory === s ? styles.filterActive : styles.filter}
                onClick={() => setFilterCategory(s)}
                aria-pressed={filterCategory === s}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <span className="log-count" style={styles.count} aria-live="polite">{filtered.length} entries</span>
      </div>

      {/* Column headers */}
      {filtered.length > 0 && (
        <div style={styles.colHeader}>
          <span style={{ width: 36 }}>#</span>
          <span style={{ flex: 1 }}>Company / Role</span>
            <span>Category / Status</span>
        </div>
      )}

      {/* Rows */}
      {filtered.length === 0 ? (
        <div style={styles.empty}>
          {apps.length === 0
            ? "Nothing logged yet. Hit Add to begin your 1000."
            : "No results match your filter."}
        </div>
      ) : (
        filtered.map((app, i) => (
          <AppRow
            key={app.id}
            app={app}
            index={i + 1}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))
      )}
    </div>
  );
}

const styles = {
  page: { padding: "32px 40px" },
  toolbar: {
    display: "flex",
    gap: 12,
    alignItems: "center",
    marginBottom: 24,
    flexWrap: "wrap",
  },
  search: {
    flex: 1,
    minWidth: 180,
    padding: "9px 14px",
    border: `1px solid ${colors.rule}`,
    borderRadius: 4,
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.ink,
    background: colors.paper,
    outline: "none",
  },
  filters: {
    display: "flex",
    gap: 0,
    border: `1px solid ${colors.rule}`,
    borderRadius: 4,
    overflow: "hidden",
  },
  filterGroup: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
  },
  filter: {
    padding: "8px 14px",
    border: "none",
    borderRight: `1px solid ${colors.rule}`,
    background: "transparent",
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.muted,
    cursor: "pointer",
  },
  filterActive: {
    padding: "8px 14px",
    border: "none",
    borderRight: `1px solid ${colors.rule}`,
    background: colors.ink,
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.paper,
    cursor: "pointer",
  },
  count: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.muted,
    marginLeft: "auto",
  },
  colHeader: {
    display: "flex",
    gap: 20,
    paddingBottom: 10,
    borderBottom: `2px solid ${colors.ink}`,
    fontFamily: fonts.body,
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: colors.muted,
    marginBottom: 0,
  },
  empty: {
    padding: "60px 0",
    textAlign: "center",
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.ghost,
    fontStyle: "italic",
  },
};
