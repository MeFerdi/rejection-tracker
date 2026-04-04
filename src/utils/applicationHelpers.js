import { CATEGORY_CONFIG, PRIORITY_CONFIG, STATUS_CONFIG } from "../styles/theme";
import { today } from "./dateHelpers";

export const DEFAULT_CATEGORY = "Job";
export const DEFAULT_STATUS = "Applied";
export const DEFAULT_PRIORITY = "Medium";

export function normalizeHistoryEntry(entry, fallbackDate) {
  return {
    status: STATUS_CONFIG[entry?.status] ? entry.status : DEFAULT_STATUS,
    date: entry?.date || fallbackDate || today(),
    note: entry?.note || "",
  };
}

export function normalizeApplication(app = {}) {
  const rawHistory = Array.isArray(app.statusHistory) ? app.statusHistory : [];
  const fallbackDate = app.statusDate || app.date || today();
  const currentStatus = STATUS_CONFIG[app.status] ? app.status : DEFAULT_STATUS;
  const currentStatusDate = app.statusDate || app.updatedAt || fallbackDate;
  const history = rawHistory.length
    ? rawHistory.map((entry) => normalizeHistoryEntry(entry, fallbackDate))
    : currentStatus === DEFAULT_STATUS
      ? [normalizeHistoryEntry({ status: currentStatus, date: currentStatusDate }, fallbackDate)]
      : [
          normalizeHistoryEntry({ status: DEFAULT_STATUS, date: app.date || fallbackDate }, fallbackDate),
          normalizeHistoryEntry({ status: currentStatus, date: currentStatusDate }, fallbackDate),
        ];

  const lastEntry = history[history.length - 1];
  const category = CATEGORY_CONFIG[app.category] ? app.category : DEFAULT_CATEGORY;
  const priority = PRIORITY_CONFIG[app.priority] ? app.priority : DEFAULT_PRIORITY;
  const followUpDate = app.followUpDate || "";

  return {
    ...app,
    category,
    priority,
    followUpDate,
    status: lastEntry.status,
    statusDate: lastEntry.date,
    updatedAt: app.updatedAt || lastEntry.date || fallbackDate,
    statusHistory: history,
  };
}

export function addStatusHistoryEntry(app, nextStatus, statusDate) {
  const normalized = normalizeApplication(app);
  const history = [...normalized.statusHistory];
  const lastEntry = history[history.length - 1];

  if (!lastEntry || lastEntry.status !== nextStatus) {
    history.push(normalizeHistoryEntry({ status: nextStatus, date: statusDate }, statusDate));
  }

  return normalizeApplication({
    ...normalized,
    status: nextStatus,
    statusDate,
    updatedAt: statusDate,
    statusHistory: history,
  });
}
