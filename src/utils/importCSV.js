const VALID_STATUSES = Object.keys(STATUS_CONFIG);
const VALID_CATEGORIES = Object.keys(CATEGORY_CONFIG);

// ── Parse a raw CSV string into an array of row objects ──
function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) throw new Error("CSV is empty or has no data rows.");

  const headers = parseRow(lines[0]).map((h) => h.trim().toLowerCase());
  const idx = (name) => headers.indexOf(name);
  const get = (cols, name) => {
    const i = idx(name);
    return i >= 0 ? cols[i]?.trim() ?? "" : "";
  };

  // Support both old format (no ID) and new format (with ID)
  const hasId = headers.includes("id");

  return lines.slice(1).map((line, i) => {
    const cols = parseRow(line);
    const rawHistory = get(cols, "status history");
    let statusHistory = [];
    if (rawHistory) {
      try {
        const parsed = JSON.parse(rawHistory);
        if (Array.isArray(parsed)) statusHistory = parsed;
      } catch {
        statusHistory = [];
      }
    }

    const dateApplied = get(cols, "date applied") || get(cols, "date");
    const status = get(cols, "status") || "Applied";
    const statusDate = get(cols, "status updated on") || get(cols, "status date") || dateApplied;

    return {
      id:       hasId ? Number(get(cols, "id")) || null : null,
      company:  get(cols, "company"),
      role:     get(cols, "role"),
      location: get(cols, "location"),
      salary:   get(cols, "salary range") || get(cols, "salary"),
      category: get(cols, "category") || "Job",
      priority: get(cols, "priority") || "Medium",
      followUpDate: get(cols, "follow-up date") || get(cols, "follow up date") || "",
      status,
      date:     dateApplied,
      statusDate,
      statusHistory,
      notes:    get(cols, "notes"),
    };
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
  if (row.category && !VALID_CATEGORIES.includes(row.category))
    errors.push(`Row ${index + 1}: Invalid category "${row.category}"`);
  if (row.date && isNaN(new Date(row.date).getTime()))
    errors.push(`Row ${index + 1}: Invalid date "${row.date}"`);
  if (row.statusDate && isNaN(new Date(row.statusDate).getTime()))
    errors.push(`Row ${index + 1}: Invalid status date "${row.statusDate}"`);
  return errors;
}

// ── Fingerprint for ID-less rows (detect duplicates by content) ──
const fingerprint = (row) =>
  `${row.company.toLowerCase()}|${row.role.toLowerCase()}|${row.date}|${(row.category || "job").toLowerCase()}`;

// ─────────────────────────────────────────────
// Main export: merge imported rows with existing records
//
// Returns:
// {
//   toAdd:     []   — new records to insert into IndexedDB
//   conflicts: []   — records that exist but differ from local content
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
      category: row.category.replace(/^[=+\-@\t\r]/, "'$&"),
      priority: row.priority.replace(/^[=+\-@\t\r]/, "'$&"),
      notes:    row.notes.replace(/^[=+\-@\t\r]/, "'$&"),
    };

    if (clean.id && existingById.has(clean.id)) {
      const existing = existingById.get(clean.id);
      if (
        existing.status !== clean.status ||
        existing.category !== clean.category ||
        JSON.stringify(existing.statusHistory || []) !== JSON.stringify(clean.statusHistory || [])
      ) {
        // Same record, different content — flag as conflict
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