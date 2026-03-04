// ─────────────────────────────────────────────
// views/AddEdit.jsx
// ─────────────────────────────────────────────

import { fonts, colors, STATUS_CONFIG } from "../styles/theme";

export default function AddEdit({ form, setForm, editId, onSubmit, onCancel }) {
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
            <label style={styles.label}>Status</label>
            <select
              style={styles.select}
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
            >
              {Object.keys(STATUS_CONFIG).map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          {field("date", "Date Applied", "", "date")}
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
