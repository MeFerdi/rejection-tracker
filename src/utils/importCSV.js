// ─────────────────────────────────────────────
// Parses an exported CSV and merges it into existing records.
//
// Merge strategy:
//   - Match by ID column (numeric timestamp from Date.now())
//   - If ID exists on this device → skip (keep local version)
//     unless the imported record has a newer/different status,
//     in which case the user is prompted to choose (see MergeResult)
//   - If ID is new → add as a new record
//   - Rows with no ID (e.g. manually edited CSVs) → generate a new ID
//     and add, deduplicating by company+role+date fingerprint
// ─────────────────────────────────────────────

const VALID_STATUSES = ["Applied", "Interview", "Rejected", "Offer"];

// ── Parse a raw CSV string into an array of row objects ──
function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) throw new Error("CSV is empty or has no data rows.");

  const headers = parseRow(lines[0]).map((h) => h.trim().toLowerCase());

  // Support both old format (no ID) and new format (with ID)
  const hasId = headers[0] === "id";

  return lines.slice(1).map((line, i) => {
    const cols = parseRow(line);
    if (hasId) {
      return {
        id:       Number(cols[0]) || null,
        company:  cols[2]?.trim() ?? "",
        role:     cols[3]?.trim() ?? "",
        location: cols[4]?.trim() ?? "",
        salary:   cols[5]?.trim() ?? "",
        status:   cols[6]?.trim() ?? "Applied",
        date:     cols[7]?.trim() ?? "",
        notes:    cols[8]?.trim() ?? "",
      };
    } else {
      // Old export format without ID column
      return {
        id:       null,
        company:  cols[1]?.trim() ?? "",
        role:     cols[2]?.trim() ?? "",
        location: cols[3]?.trim() ?? "",
        salary:   cols[4]?.trim() ?? "",
        status:   cols[5]?.trim() ?? "Applied",
        date:     cols[6]?.trim() ?? "",
        notes:    cols[7]?.trim() ?? "",
      };
    }
  });
}

// ── Parse a single CSV row respecting quoted fields ──
function parseRow(line) {
  const cols = [];
  let cur = "";
  let inQuote = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuote && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuote = !inQuote;
      }
    } else if (ch === "," && !inQuote) {
      cols.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  cols.push(cur);
  return cols;
}

// ── Validate a parsed row ──
function validateRow(row, index) {
  const errors = [];
  if (!row.company) errors.push(`Row ${index + 1}: Company is required`);
  if (!row.role)    errors.push(`Row ${index + 1}: Role is required`);
  if (row.status && !VALID_STATUSES.includes(row.status))
    errors.push(`Row ${index + 1}: Invalid status "${row.status}"`);
  if (row.date && isNaN(new Date(row.date).getTime()))
    errors.push(`Row ${index + 1}: Invalid date "${row.date}"`);
  return errors;
}

// ── Fingerprint for ID-less rows (detect duplicates by content) ──
const fingerprint = (row) =>
  `${row.company.toLowerCase()}|${row.role.toLowerCase()}|${row.date}`;

// ─────────────────────────────────────────────
// Main export: merge imported rows with existing records
//
// Returns:
// {
//   toAdd:     []   — new records to insert into IndexedDB
//   conflicts: []   — records that exist but with different status
//                     { incoming, existing } — let the user decide
//   skipped:   number  — duplicates ignored
//   errors:    []   — validation errors
// }
// ─────────────────────────────────────────────
export function mergeImport(csvText, existingApps) {
  let rows;
  try {
    rows = parseCSV(csvText);
  } catch (e) {
    return { toAdd: [], conflicts: [], skipped: 0, errors: [e.message] };
  }

  const errors = rows.flatMap((r, i) => validateRow(r, i));
  if (errors.length) return { toAdd: [], conflicts: [], skipped: 0, errors };

  const existingById          = new Map(existingApps.map((a) => [a.id, a]));
  const existingByFingerprint = new Map(existingApps.map((a) => [fingerprint(a), a]));

  const toAdd     = [];
  const conflicts = [];
  let   skipped   = 0;

  for (const row of rows) {
    // Strip formula injection from imported data too
    const clean = {
      ...row,
      company:  row.company.replace(/^[=+\-@\t\r]/, "'$&"),
      role:     row.role.replace(/^[=+\-@\t\r]/, "'$&"),
      location: row.location.replace(/^[=+\-@\t\r]/, "'$&"),
      notes:    row.notes.replace(/^[=+\-@\t\r]/, "'$&"),
    };

    if (clean.id && existingById.has(clean.id)) {
      const existing = existingById.get(clean.id);
      if (existing.status !== clean.status) {
        // Same record, different status — flag as conflict
        conflicts.push({ incoming: clean, existing });
      } else {
        skipped++;
      }
      continue;
    }

    // No ID — check by fingerprint
    if (!clean.id) {
      const fp = fingerprint(clean);
      if (existingByFingerprint.has(fp)) {
        skipped++;
        continue;
      }
      clean.id = Date.now() + Math.floor(Math.random() * 1000);
    }

    toAdd.push(clean);
  }

  return { toAdd, conflicts, skipped, errors: [] };
}