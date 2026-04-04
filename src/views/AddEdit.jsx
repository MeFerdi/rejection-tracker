import { fonts, colors, STATUS_CONFIG, CATEGORY_CONFIG, PRIORITY_CONFIG } from "../styles/theme";

export default function AddEdit({ form, setForm, editId, onSubmit, onCancel }) {
  const history = Array.isArray(form.statusHistory) && form.statusHistory.length
    ? form.statusHistory
    : [{ status: form.status, date: form.statusDate || form.date, note: "" }];

  const field = (key, label, placeholder, type = "text") => (
    <div style={styles.field}>
      <label style={styles.label}>{label}</label>
      <input
        type={type}
        style={styles.input}
        placeholder={placeholder}
        value={form[key]}
        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
      />
    </div>
  );

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.heading}>
          {editId ? "Edit Application" : "Log New Application"}
        </div>

        <div style={styles.grid2}>
          {field("company",  "Company *",      "e.g. Safaricom")}
          {field("role",     "Role *",          "e.g. Product Manager")}
          {field("location", "Location",        "e.g. Nairobi / Remote")}
          {field("salary",   "Salary Range",    "e.g. KES 120k – 180k")}
        </div>

        <div style={styles.grid2}>
          <div style={styles.field}>
            <label style={styles.label}>Category</label>
            <select
              style={styles.select}
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            >
              {Object.keys(CATEGORY_CONFIG).map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Priority</label>
            <select
              style={styles.select}
              value={form.priority}
              onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value }))}
            >
              {Object.keys(PRIORITY_CONFIG).map((priority) => (
                <option key={priority}>{priority}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={styles.grid2}>
          {field("date", "Date Applied", "", "date")}
          {field("followUpDate", "Follow-up Reminder", "", "date")}
        </div>

        <div style={styles.grid2}>
          <div style={styles.field}>
            <label style={styles.label}>Current Status</label>
            <select
              style={styles.select}
              value={form.status}
              onChange={(e) => setForm((f) => ({
                ...f,
                status: e.target.value,
                statusHistory: f.statusHistory?.length
                  ? f.statusHistory.map((entry, index) => index === f.statusHistory.length - 1
                    ? { ...entry, status: e.target.value }
                    : entry)
                  : [{ status: e.target.value, date: f.statusDate || f.date, note: "" }],
              }))}
            >
              {Object.keys(STATUS_CONFIG).map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          {field("statusDate", "Current Status Date", "", "date")}
        </div>

        <div style={styles.historySection}>
          <div style={styles.historyHeader}>
            <label style={styles.label}>Stage History</label>
            <button
              type="button"
              style={styles.smallBtn}
              onClick={() => setForm((f) => ({
                ...f,
                statusHistory: [
                  ...(f.statusHistory || []),
                  { status: f.status || "Applied", date: f.statusDate || f.date || "", note: "" },
                ],
              }))}
            >
              + Add stage
            </button>
          </div>

          <div style={styles.historyList}>
            {history.map((entry, index) => (
              <div key={`${entry.status}-${index}`} style={styles.historyRow}>
                <select
                  style={styles.historySelect}
                  value={entry.status}
                  onChange={(e) => setForm((f) => ({
                    ...f,
                    statusHistory: (f.statusHistory || history).map((item, i) => i === index
                      ? { ...item, status: e.target.value }
                      : item),
                    status: index === history.length - 1 ? e.target.value : f.status,
                  }))}
                >
                  {Object.keys(STATUS_CONFIG).map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
                <input
                  type="date"
                  style={styles.historyDate}
                  value={entry.date}
                  onChange={(e) => setForm((f) => ({
                    ...f,
                    statusHistory: (f.statusHistory || history).map((item, i) => i === index
                      ? { ...item, date: e.target.value }
                      : item),
                    statusDate: index === history.length - 1 ? e.target.value : f.statusDate,
                  }))}
                />
                <input
                  type="text"
                  style={styles.historyNote}
                  placeholder="Note"
                  value={entry.note || ""}
                  onChange={(e) => setForm((f) => ({
                    ...f,
                    statusHistory: (f.statusHistory || history).map((item, i) => i === index
                      ? { ...item, note: e.target.value }
                      : item),
                  }))}
                />
                <button
                  type="button"
                  style={styles.removeBtn}
                  onClick={() => setForm((f) => ({
                    ...f,
                    statusHistory: (f.statusHistory || history).filter((_, i) => i !== index),
                  }))}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Notes / Reflection</label>
          <textarea
            style={styles.textarea}
            placeholder="How did this go? Any learnings or observations?"
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
          />
        </div>

        <div style={styles.actions}>
          <button style={styles.submit} onClick={onSubmit}>
            {editId ? "Save Changes" : "Log Application"}
          </button>
          {editId && (
            <button style={styles.cancel} onClick={onCancel}>Cancel</button>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: "32px 40px",
    display: "flex",
    justifyContent: "center",
  },
  card: {
    width: "100%",
    maxWidth: 640,
    border: `1px solid ${colors.rule}`,
    borderRadius: 4,
    padding: "32px 36px",
    background: colors.paper,
  },
  heading: {
    fontFamily: fonts.display,
    fontSize: 22,
    fontWeight: 700,
    color: colors.ink,
    marginBottom: 28,
    paddingBottom: 16,
    borderBottom: `1px solid ${colors.rule}`,
  },
  grid2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "0 24px",
  },
  field: { marginBottom: 18 },
  label: {
    display: "block",
    fontFamily: fonts.body,
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: colors.muted,
    marginBottom: 6,
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    border: `1px solid ${colors.rule}`,
    borderRadius: 4,
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.ink,
    background: colors.offwhite,
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.15s",
  },
  select: {
    width: "100%",
    padding: "10px 12px",
    border: `1px solid ${colors.rule}`,
    borderRadius: 4,
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.ink,
    background: colors.offwhite,
    outline: "none",
    boxSizing: "border-box",
  },
  historySection: {
    marginTop: 4,
    marginBottom: 18,
    padding: 16,
    border: `1px solid ${colors.rule}`,
    borderRadius: 6,
    background: colors.offwhite,
  },
  historyHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  smallBtn: {
    border: `1px solid ${colors.rule}`,
    background: colors.paper,
    color: colors.ink,
    borderRadius: 999,
    fontFamily: fonts.body,
    fontSize: 11,
    padding: "6px 10px",
    cursor: "pointer",
  },
  historyList: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  historyRow: {
    display: "grid",
    gridTemplateColumns: "1fr 140px 1.2fr auto",
    gap: 8,
    alignItems: "center",
  },
  historySelect: {
    padding: "9px 10px",
    border: `1px solid ${colors.rule}`,
    borderRadius: 4,
    background: colors.paper,
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.ink,
  },
  historyDate: {
    padding: "9px 10px",
    border: `1px solid ${colors.rule}`,
    borderRadius: 4,
    background: colors.paper,
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.ink,
  },
  historyNote: {
    padding: "9px 10px",
    border: `1px solid ${colors.rule}`,
    borderRadius: 4,
    background: colors.paper,
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.ink,
  },
  removeBtn: {
    border: "none",
    background: "transparent",
    color: colors.rejected,
    fontFamily: fonts.body,
    fontSize: 12,
    cursor: "pointer",
    padding: 0,
    textDecoration: "underline",
  },
  textarea: {
    width: "100%",
    padding: "10px 12px",
    border: `1px solid ${colors.rule}`,
    borderRadius: 4,
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.ink,
    background: colors.offwhite,
    outline: "none",
    boxSizing: "border-box",
    minHeight: 100,
    resize: "vertical",
  },
  actions: {
    display: "flex",
    gap: 12,
    marginTop: 8,
    paddingTop: 20,
    borderTop: `1px solid ${colors.rule}`,
  },
  submit: {
    padding: "11px 28px",
    background: colors.ink,
    border: "none",
    borderRadius: 4,
    fontFamily: fonts.body,
    fontSize: 14,
    fontWeight: 600,
    color: colors.paper,
    cursor: "pointer",
    letterSpacing: "0.02em",
  },
  cancel: {
    padding: "11px 20px",
    background: "transparent",
    border: `1px solid ${colors.rule}`,
    borderRadius: 4,
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.muted,
    cursor: "pointer",
  },
};
