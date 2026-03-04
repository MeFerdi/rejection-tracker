// ─────────────────────────────────────────────
// Full import flow:
//   1. Drop / select CSV file
//   2. Parse + preview what will be added
//   3. Resolve any status conflicts
//   4. Confirm → write to IndexedDB
// ─────────────────────────────────────────────

import { useState, useRef } from "react";
import { fonts, colors, STATUS_CONFIG } from "../styles/theme";
import { mergeImport } from "../utils/importCSV";
import { addApp, updateApp } from "../utils/db";

const STEPS = { IDLE: "idle", PREVIEW: "preview", DONE: "done" };

export default function ImportModal({ existingApps, onComplete, onClose }) {
  const [step,      setStep]      = useState(STEPS.IDLE);
  const [dragging,  setDragging]  = useState(false);
  const [result,    setResult]    = useState(null);
  const [conflicts, setConflicts] = useState([]);   // { incoming, existing, choice }
  const [loading,   setLoading]   = useState(false);
  const [summary,   setSummary]   = useState(null);
  const fileRef = useRef();

  // ── File handling ───────────────────────────
  const handleFile = (file) => {
    if (!file || !file.name.endsWith(".csv")) {
      alert("Please select a .csv file exported from this app.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const parsed = mergeImport(e.target.result, existingApps);
      if (parsed.errors.length) {
        alert("Import errors:\n" + parsed.errors.join("\n"));
        return;
      }
      setResult(parsed);
      setConflicts(
        parsed.conflicts.map((c) => ({ ...c, choice: "keep" }))
        // choice: "keep" = keep local, "incoming" = use imported status
      );
      setStep(STEPS.PREVIEW);
    };
    reader.readAsText(file);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  // ── Confirm import ──────────────────────────
  const confirmImport = async () => {
    setLoading(true);
    let added = 0, updated = 0;

    // Write new records
    for (const app of result.toAdd) {
      await addApp(app);
      added++;
    }

    // Apply conflict resolutions
    for (const c of conflicts) {
      if (c.choice === "incoming") {
        await updateApp({ ...c.existing, status: c.incoming.status });
        updated++;
      }
    }

    setLoading(false);
    setSummary({ added, updated, skipped: result.skipped });
    setStep(STEPS.DONE);
    onComplete(); // re-hydrate parent state from IndexedDB
  };

  return (
    <div style={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={styles.modal}>

        {/* Header */}
        <div style={styles.modalHeader}>
          <div style={styles.modalTitle}>Import from CSV</div>
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        {/* ── STEP 1: Drop zone ── */}
        {step === STEPS.IDLE && (
          <>
            <p style={styles.desc}>
              Export your data from another device, transfer the CSV file here
              (AirDrop, WhatsApp, Google Drive, email — anything works), then
              upload it below. Duplicates are detected automatically.
            </p>

            <div
              style={{ ...styles.dropzone, ...(dragging ? styles.dropzoneActive : {}) }}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              onClick={() => fileRef.current.click()}
            >
              <div style={styles.dropIcon}>📂</div>
              <div style={styles.dropLabel}>
                Drop your CSV here, or click to browse
              </div>
              <div style={styles.dropSub}>
                Only CSV files exported from this app are supported
              </div>
              <input
                ref={fileRef}
                type="file"
                accept=".csv"
                style={{ display: "none" }}
                onChange={(e) => handleFile(e.target.files[0])}
              />
            </div>
          </>
        )}

        {/* ── STEP 2: Preview + conflicts ── */}
        {step === STEPS.PREVIEW && result && (
          <>
            {/* Summary counts */}
            <div style={styles.countRow}>
              <div style={styles.countBox}>
                <div style={{ ...styles.countNum, color: colors.offer }}>{result.toAdd.length}</div>
                <div style={styles.countLabel}>New to add</div>
              </div>
              <div style={styles.countBox}>
                <div style={{ ...styles.countNum, color: colors.interview }}>{conflicts.length}</div>
                <div style={styles.countLabel}>Conflicts</div>
              </div>
              <div style={styles.countBox}>
                <div style={{ ...styles.countNum, color: colors.muted }}>{result.skipped}</div>
                <div style={styles.countLabel}>Duplicates skipped</div>
              </div>
            </div>

            {/* New records preview */}
            {result.toAdd.length > 0 && (
              <div style={styles.section}>
                <div style={styles.sectionLabel}>Records to be added</div>
                <div style={styles.previewList}>
                  {result.toAdd.slice(0, 8).map((a, i) => (
                    <div key={i} style={styles.previewRow}>
                      <span style={styles.previewCompany}>{a.company}</span>
                      <span style={styles.previewRole}>{a.role}</span>
                      <span style={{ ...styles.previewBadge, color: STATUS_CONFIG[a.status]?.color }}>
                        {a.status}
                      </span>
                    </div>
                  ))}
                  {result.toAdd.length > 8 && (
                    <div style={styles.moreLabel}>
                      +{result.toAdd.length - 8} more records
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Conflict resolution */}
            {conflicts.length > 0 && (
              <div style={styles.section}>
                <div style={styles.sectionLabel}>
                  Status conflicts — choose which version to keep
                </div>
                {conflicts.map((c, i) => (
                  <div key={i} style={styles.conflictRow}>
                    <div style={styles.conflictMeta}>
                      <span style={styles.previewCompany}>{c.incoming.company}</span>
                      <span style={styles.previewRole}>{c.incoming.role}</span>
                    </div>
                    <div style={styles.conflictChoices}>
                      <button
                        style={c.choice === "keep"
                          ? { ...styles.choiceBtn, ...styles.choiceBtnActive }
                          : styles.choiceBtn}
                        onClick={() => setConflicts((prev) =>
                          prev.map((x, j) => j === i ? { ...x, choice: "keep" } : x)
                        )}
                      >
                        Keep local
                        <span style={{ color: STATUS_CONFIG[c.existing.status]?.color, marginLeft: 6 }}>
                          ({c.existing.status})
                        </span>
                      </button>
                      <button
                        style={c.choice === "incoming"
                          ? { ...styles.choiceBtn, ...styles.choiceBtnActive }
                          : styles.choiceBtn}
                        onClick={() => setConflicts((prev) =>
                          prev.map((x, j) => j === i ? { ...x, choice: "incoming" } : x)
                        )}
                      >
                        Use imported
                        <span style={{ color: STATUS_CONFIG[c.incoming.status]?.color, marginLeft: 6 }}>
                          ({c.incoming.status})
                        </span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {result.toAdd.length === 0 && conflicts.length === 0 && (
              <div style={styles.allSkipped}>
                All records in this file already exist on this device. Nothing to import.
              </div>
            )}

            <div style={styles.actions}>
              <button style={styles.cancelBtn} onClick={() => setStep(STEPS.IDLE)}>
                Back
              </button>
              {(result.toAdd.length > 0 || conflicts.some((c) => c.choice === "incoming")) && (
                <button style={styles.confirmBtn} onClick={confirmImport} disabled={loading}>
                  {loading ? "Importing…" : `Confirm Import`}
                </button>
              )}
            </div>
          </>
        )}

        {/* ── STEP 3: Done ── */}
        {step === STEPS.DONE && summary && (
          <div style={styles.doneWrap}>
            <div style={styles.doneIcon}>✓</div>
            <div style={styles.doneTitle}>Import complete</div>
            <div style={styles.doneCounts}>
              {summary.added   > 0 && <span>{summary.added} records added</span>}
              {summary.updated > 0 && <span>{summary.updated} statuses updated</span>}
              {summary.skipped > 0 && <span>{summary.skipped} duplicates skipped</span>}
            </div>
            <button style={styles.confirmBtn} onClick={onClose}>Done</button>
          </div>
        )}

      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(17,16,16,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
    padding: 20,
  },
  modal: {
    background: colors.paper,
    border: `1px solid ${colors.rule}`,
    borderRadius: 6,
    padding: "28px 32px",
    width: "100%",
    maxWidth: 540,
    maxHeight: "90vh",
    overflowY: "auto",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 14,
    borderBottom: `1px solid ${colors.rule}`,
  },
  modalTitle: {
    fontFamily: fonts.display,
    fontSize: 20,
    fontWeight: 700,
    color: colors.ink,
  },
  closeBtn: {
    background: "none",
    border: "none",
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.muted,
    cursor: "pointer",
    padding: "0 4px",
  },
  desc: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.muted,
    lineHeight: 1.6,
    marginBottom: 20,
  },
  dropzone: {
    border: `2px dashed ${colors.ghost}`,
    borderRadius: 6,
    padding: "40px 24px",
    textAlign: "center",
    cursor: "pointer",
    transition: "border-color 0.15s, background 0.15s",
  },
  dropzoneActive: {
    borderColor: colors.ink,
    background: colors.offwhite,
  },
  dropIcon:  { fontSize: 32, marginBottom: 10 },
  dropLabel: { fontFamily: fonts.body, fontSize: 15, fontWeight: 600, color: colors.ink, marginBottom: 6 },
  dropSub:   { fontFamily: fonts.body, fontSize: 12, color: colors.muted },

  countRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: 12,
    marginBottom: 20,
  },
  countBox: {
    border: `1px solid ${colors.rule}`,
    borderRadius: 4,
    padding: "14px 16px",
    textAlign: "center",
  },
  countNum:   { fontFamily: fonts.display, fontSize: 28, fontWeight: 700 },
  countLabel: { fontFamily: fonts.body, fontSize: 11, color: colors.muted, textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 4 },

  section:      { marginBottom: 20 },
  sectionLabel: { fontFamily: fonts.body, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: colors.muted, marginBottom: 10 },

  previewList: { border: `1px solid ${colors.rule}`, borderRadius: 4, overflow: "hidden" },
  previewRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "9px 14px",
    borderBottom: `1px solid ${colors.rule}`,
    fontFamily: fonts.body,
    fontSize: 13,
  },
  previewCompany: { fontWeight: 600, color: colors.ink, minWidth: 100 },
  previewRole:    { color: colors.muted, flex: 1 },
  previewBadge:   { fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" },
  moreLabel:      { padding: "8px 14px", fontFamily: fonts.body, fontSize: 12, color: colors.muted, fontStyle: "italic" },

  conflictRow: {
    border: `1px solid ${colors.rule}`,
    borderRadius: 4,
    padding: "12px 14px",
    marginBottom: 8,
  },
  conflictMeta:    { display: "flex", gap: 8, marginBottom: 10, alignItems: "baseline" },
  conflictChoices: { display: "flex", gap: 8 },
  choiceBtn: {
    flex: 1,
    padding: "8px 12px",
    border: `1px solid ${colors.rule}`,
    borderRadius: 4,
    background: "transparent",
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.muted,
    cursor: "pointer",
    textAlign: "center",
  },
  choiceBtnActive: {
    background: colors.ink,
    color: colors.paper,
    borderColor: colors.ink,
  },

  allSkipped: {
    padding: "24px 0",
    textAlign: "center",
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.muted,
    fontStyle: "italic",
  },

  actions: {
    display: "flex",
    gap: 10,
    marginTop: 20,
    paddingTop: 16,
    borderTop: `1px solid ${colors.rule}`,
    justifyContent: "flex-end",
  },
  cancelBtn: {
    padding: "10px 20px",
    background: "transparent",
    border: `1px solid ${colors.rule}`,
    borderRadius: 4,
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.muted,
    cursor: "pointer",
  },
  confirmBtn: {
    padding: "10px 24px",
    background: colors.ink,
    border: "none",
    borderRadius: 4,
    fontFamily: fonts.body,
    fontSize: 13,
    fontWeight: 600,
    color: colors.paper,
    cursor: "pointer",
  },

  doneWrap:   { textAlign: "center", padding: "20px 0" },
  doneIcon:   { fontSize: 40, color: colors.offer, marginBottom: 12 },
  doneTitle:  { fontFamily: fonts.display, fontSize: 22, fontWeight: 700, color: colors.ink, marginBottom: 12 },
  doneCounts: { display: "flex", gap: 16, justifyContent: "center", fontFamily: fonts.body, fontSize: 13, color: colors.muted, marginBottom: 24, flexWrap: "wrap" },
};