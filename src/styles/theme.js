export const fonts = {
  display: `'Playfair Display', Georgia, serif`,
  body: `'DM Sans', 'Helvetica Neue', sans-serif`,
  mono: `'DM Mono', 'Courier New', monospace`,
};

export const colors = {
  // Base
  ink:      "#111010",
  paper:    "#F7F5F2",
  offwhite: "#EDEAE5",
  mid:      "#C8C4BC",
  muted:    "#8A8680",
  ghost:    "#D4D0CA",

  // Status — muted, natural
  applied:   "#4A6FA5",
  interview: "#C4882B",
  rejected:  "#B04040",
  offer:     "#3A7D5A",

  // Categories — balanced accent set
  job:         "#5C6F7F",
  internship:  "#7A5C9E",
  grant:       "#4D8C7A",
  scholarship: "#A06A4A",
  fellowship:  "#8B5E6B",

  // Priority — clear, compact triage cues
  priorityHigh:   "#B04040",
  priorityMedium: "#C4882B",
  priorityLow:    "#4A6FA5",

  // Borders
  rule:    "#DEDAD4",
  ruleDark:"#2A2826",
};

export const STATUS_CONFIG = {
  Applied:   { color: colors.applied,   dot: "○", label: "Applied"   },
  Interview: { color: colors.interview, dot: "◐", label: "Interview" },
  Rejected:  { color: colors.rejected,  dot: "●", label: "Rejected"  },
  Offer:     { color: colors.offer,     dot: "★", label: "Offer"     },
};

export const CATEGORY_CONFIG = {
  Job:         { color: colors.job,         label: "Job" },
  Internship:  { color: colors.internship,  label: "Internship" },
  Grant:       { color: colors.grant,       label: "Grant" },
  Scholarship: { color: colors.scholarship, label: "Scholarship" },
  Fellowship:  { color: colors.fellowship,  label: "Fellowship" },
};

export const PRIORITY_CONFIG = {
  High:   { color: colors.priorityHigh, label: "High" },
  Medium: { color: colors.priorityMedium, label: "Medium" },
  Low:    { color: colors.priorityLow, label: "Low" },
};

export const GOAL = 1000;

export const QUOTES = [
  "The path through rejection is the only path that leads anywhere real.",
  "Every no is data. Collect it deliberately.",
  "Resilience is not a trait. It is a practice.",
  "The grind belongs to those who show up again.",
  "You are not looking for a job. You are building evidence.",
  "Discomfort is the curriculum. Keep enrolling.",
  "Each application is a small act of courage.",
  "Progress compounds. Trust the volume.",
];
