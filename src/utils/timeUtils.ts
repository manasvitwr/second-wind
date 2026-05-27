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
  'jan', 'feb', 'mar', 'april', 'may', 'june',
  'july', 'aug', 'sept', 'oct', 'nov', 'dec',
];

// ─── active-page subtext ─────────────────────────────────────────────────────

/**
 * Returns the subtext label shown below a task on the Active page.
 */
export function getActiveTaskSubtext(task: Task, now: Date = new Date()): string {
  const created = task.createdAt instanceof Date ? task.createdAt : new Date(task.createdAt);

  const hasBeenTouched =
    task.updatedAt != null &&
    new Date(task.updatedAt).getTime() > created.getTime() + 1000;

  const refDate = hasBeenTouched ? new Date(task.updatedAt!) : created;
  const diffDays = daysDiff(refDate, now);
  const prefix = hasBeenTouched ? 'touched ' : 'added ';

  if (diffDays >= 14) {
    const monthLabel = MONTH_NAMES[refDate.getMonth()];
    return hasBeenTouched ? `touched in ${monthLabel}` : `sitting since ${monthLabel}`;
  }

  if (diffDays >= 1) {
    return `${prefix}${diffDays}d ago`;
  }

  const hrs = hoursDiff(refDate, now);
  if (hrs >= 1) {
    return `${prefix}${hrs}h ago`;
  }

  const mins = minutesDiff(refDate, now);
  if (mins >= 1) {
    return `${prefix}${mins}m ago`;
  }

<<<<<<< HEAD
  // within today — use minute/hour precision
  const mins = minutesDiff(touchRef, now);
  if (mins < 1) {
    return `touched just now`;
  }
  if (mins < 60) {
    return `touched ${mins}m ago`;
  }

  const hrs = hoursDiff(touchRef, now);
  if (hrs < 1) {
    return `touched just now`;
  }
  return `touched ${hrs}h ago`;
=======
  return `${prefix}just now`;
>>>>>>> 7537204 (upd: format task subtext w/ added/touched prefixes)
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

// ─── completed-page subtext ──────────────────────────────────────────────────

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

function formatDate(d: Date): string {
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`;
}

/**
 * Returns the subtext label shown below a task on the Completed page.
 *
 * Bucket    │ completedAt age  │ label
 * ──────────┼──────────────────┼──────────────────────────
 * recent    │ < 24 h           │ "Xm ago" / "Xh ago"
 * thisWeek  │ 1–6 days         │ "done on Mon" / "done on Fri" etc.
 * thisMonth │ 7–27 days        │ "done on DD/MM/YYYY"
 * awhileAgo │ 28+ days         │ "done on DD/MM/YYYY"
 */
export function getCompletedTaskSubtext(task: Task, now: Date = new Date()): string {
  if (!task.completedAt) return '';

  const completed = task.completedAt instanceof Date
    ? task.completedAt
    : new Date(task.completedAt);

  const mins = Math.max(0, minutesDiff(completed, now));
  if (mins < 60) return `${mins}m ago`;

  const hrs = Math.max(0, hoursDiff(completed, now));
  if (hrs < 24) return `${hrs}h ago`;

  const daysAgo = daysDiff(completed, now);

  // this week: 1–6 days → day name
  if (daysAgo <= 6) return `done on ${DAY_NAMES[completed.getDay()]}`;

  // this month + a while ago: full date
  return `done on ${formatDate(completed)}`;
}

// ─── completed-page bucket classifier ────────────────────────────────────────

/**
 * Groups completed tasks into display buckets for the Completed page.
 *  - 'recent'    — completed within the last 24 h
 *  - 'thisWeek'  — completed 1–6 days ago
 *  - 'thisMonth' — completed 7–27 days ago
 *  - 'awhileAgo' — completed 28+ days ago (tasks auto-expire at 2 months)
 */
export type CompletedBucket = 'recent' | 'thisWeek' | 'thisMonth' | 'awhileAgo';

export function getCompletedBucket(task: Task, now: Date = new Date()): CompletedBucket {
  if (!task.completedAt) return 'awhileAgo';

  const completed = task.completedAt instanceof Date
    ? task.completedAt
    : new Date(task.completedAt);

  const hrs = hoursDiff(completed, now);
  if (hrs < 24) return 'recent';

  const daysAgo = daysDiff(completed, now);
  if (daysAgo <= 6) return 'thisWeek';
  if (daysAgo <= 27) return 'thisMonth';
  return 'awhileAgo';
}
