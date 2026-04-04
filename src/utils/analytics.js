import { STATUS_CONFIG } from "../styles/theme";

const toDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const daysBetween = (start, end) => {
  const a = toDate(start);
  const b = toDate(end);
  if (!a || !b) return null;
  return Math.max(0, Math.round((b - a) / 86400000));
};

const isFinalStatus = (status) => status === "Rejected" || status === "Offer";

export function computeAnalytics(apps) {
  const counts = Object.keys(STATUS_CONFIG).reduce((acc, key) => {
    acc[key] = 0;
    return acc;
  }, {});

  let overdueFollowUps = 0;
  let totalLifecycleDays = 0;
  let lifecycleSamples = 0;
  let totalDecisionDays = 0;
  let decisionSamples = 0;

  apps.forEach((app) => {
    const status = STATUS_CONFIG[app.status] ? app.status : "Applied";
    counts[status] = (counts[status] || 0) + 1;

    const history = Array.isArray(app.statusHistory) && app.statusHistory.length
      ? app.statusHistory
      : [{ status, date: app.statusDate || app.date }];

    const firstStep = history[0];
    const lastStep = history[history.length - 1];
    const lifecycleDays = daysBetween(firstStep?.date, lastStep?.date);
    if (lifecycleDays !== null) {
      totalLifecycleDays += lifecycleDays;
      lifecycleSamples++;
    }

    if (isFinalStatus(status)) {
      const decisionDays = daysBetween(app.date, app.statusDate || app.updatedAt || app.date);
      if (decisionDays !== null) {
        totalDecisionDays += decisionDays;
        decisionSamples++;
      }
    }

    if (app.followUpDate) {
      const due = toDate(app.followUpDate);
      const now = new Date();
      if (due && due < now && !isFinalStatus(status)) overdueFollowUps++;
    }
  });

  const total = apps.length || 1;
  const interviewCount = counts.Interview || 0;
  const offerCount = counts.Offer || 0;
  const activePipeline = (counts.Applied || 0) + interviewCount;

  return {
    counts,
    totalApps: apps.length,
    activePipeline,
    interviewRate: Math.round((interviewCount / total) * 100),
    offerRate: Math.round((offerCount / total) * 100),
    avgLifecycleDays: lifecycleSamples ? Math.round(totalLifecycleDays / lifecycleSamples) : 0,
    avgDecisionDays: decisionSamples ? Math.round(totalDecisionDays / decisionSamples) : 0,
    overdueFollowUps,
  };
}
