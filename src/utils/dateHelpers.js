// ─────────────────────────────────────────────
// utils/constants.js
// ─────────────────────────────────────────────

export const GOAL = 1000;

export const today = () => new Date().toISOString().split("T")[0];

// ─────────────────────────────────────────────
// utils/dateHelpers.js
// ─────────────────────────────────────────────

export const getWeekKey = (dateStr) => {
  const d = new Date(dateStr);
  const jan1 = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil(((d - jan1) / 86400000 + jan1.getDay() + 1) / 7);
  return `W${String(week).padStart(2, "0")}`;
};

export const getMonthKey = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleString("default", { month: "short" });
};

export const MONTH_ORDER = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec",
];

export const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};
