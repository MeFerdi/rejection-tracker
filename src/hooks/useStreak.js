// ─────────────────────────────────────────────
// hooks/useStreak.js
// Calculates consecutive days with applications
// ─────────────────────────────────────────────

import { useMemo } from "react";

export function useStreak(apps) {
  return useMemo(() => {
    if (!apps.length) return 0;
    const days = new Set(apps.map((a) => a.date));
    let streak = 0;
    const cursor = new Date();
    while (true) {
      const key = cursor.toISOString().split("T")[0];
      if (days.has(key)) {
        streak++;
        cursor.setDate(cursor.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  }, [apps]);
}
