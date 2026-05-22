import type { Task } from '../types/Task';

// ─── helpers ────────────────────────────────────────────────────────────────

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function daysDiff(a: Date, b: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.floor(
    (startOfDay(b).getTime() - startOfDay(a).getTime()) / msPerDay
  );
}

function minutesDiff(a: Date, b: Date): number {
  return Math.floor((b.getTime() - a.getTime()) / (1000 * 60));
}

function hoursDiff(a: Date, b: Date): number {
  return Math.floor((b.getTime() - a.getTime()) / (1000 * 60 * 60));
}

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

// ─── active-page subtext ─────────────────────────────────────────────────────

/**
 * Returns the subtext label shown below a task on the Active page.
 *
 * Rules:
 *  - "added today"         — createdAt is today (regardless of touch)
 *  - "touched Xm ago"      — last touch within the past 60 min (and was touched, i.e. updatedAt > createdAt)
 *  - "touched Xh ago"      — last touch within the past 24 h
 *  - "touched yesterday"   — last touch was yesterday
 *  - "touched Xd ago"      — last touch 2–13 days ago
 *  - "sitting since <Mon>" — last touch (or creation) 14+ days ago
 *  - "untouched for Xd"    — never touched since creation (updatedAt absent or == createdAt), sitting >0 days
 */
export function getActiveTaskSubtext(task: Task, now: Date = new Date()): string {
  const created = task.createdAt instanceof Date ? task.createdAt : new Date(task.createdAt);
  const createdDaysAgo = daysDiff(created, now);

  // "added today" — created today, we don't care about touch
  if (createdDaysAgo === 0) {
    return 'added today';
  }

  const hasBeenTouched =
    task.updatedAt != null &&
    task.updatedAt instanceof Date &&
    task.updatedAt.getTime() > created.getTime();

  const touchRef = hasBeenTouched ? (task.updatedAt as Date) : created;
  const touchDaysAgo = daysDiff(touchRef, now);

  // "untouched for Xd" — never touched since creation, sitting >0 days
  if (!hasBeenTouched) {
    return `untouched for ${createdDaysAgo}d`;
  }

  // "sitting since <MonthName>" — last touch 14+ days ago
  if (touchDaysAgo >= 14) {
    const monthLabel = MONTH_NAMES[touchRef.getMonth()];
    return `sitting since ${monthLabel}`;
  }

  // "touched yesterday"
  if (touchDaysAgo === 1) {
    return 'touched yesterday';
  }

  // "touched Xd ago" — 2–13 days
  if (touchDaysAgo >= 2) {
    return `touched ${touchDaysAgo}d ago`;
  }

  // within today — use minute/hour precision
  const mins = minutesDiff(touchRef, now);
  if (mins < 60) {
    return `touched ${mins}m ago`;
  }

  const hrs = hoursDiff(touchRef, now);
  return `touched ${hrs}h ago`;
}

// ─── age bucket classifier (for Active page grouping) ────────────────────────

/**
 * Returns the age bucket for grouping on the Active page.
 *  - 'today'   — createdAt today
 *  - 'earlier' — createdAt 1–13 days ago
 *  - 'old'     — createdAt 14+ days ago
 */
export type ActiveAgeBucket = 'today' | 'earlier' | 'old';

export function getActiveAgeBucket(task: Task, now: Date = new Date()): ActiveAgeBucket {
  const created = task.createdAt instanceof Date ? task.createdAt : new Date(task.createdAt);
  const daysAgo = daysDiff(created, now);

  if (daysAgo === 0) return 'today';
  if (daysAgo <= 13) return 'earlier';
  return 'old';
}
