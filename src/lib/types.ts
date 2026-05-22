export interface Task {
  id: string;
  title: string;
  completed: boolean;
  children?: Task[];
  isHabit?: boolean;
  createdAt: Date;
  completedAt?: Date;
  updatedAt?: Date;
}

export interface Habit {
  id: string;
  title: string;
  lastCompletedDate?: string;
  isActive: boolean;
  streak?: number;
  createdAt: Date;
  resetTime?: string;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  parentId: string;
  createdAt: Date;
  completedAt?: Date;
}

export type FilterType = 'all' | 'active' | 'completed' | 'analytics';

export interface TaskTreeState {
  tasks: Task[];
  filter: FilterType;
}

/**
 * Anonymous record logged when a completed task auto-expires (2+ months old, untouched).
 * No task name is stored — only activity metadata for analytics.
 */
export interface ActivityRecord {
  /** ISO date string of the day this task was created */
  createdAt: string;
  /** ISO date string of when it was completed */
  completedAt: string;
  /** ISO date string of last touch (updatedAt), if any */
  updatedAt?: string;
  /** Total number of subtasks the task had */
  subtaskCount: number;
  /** Number of completed subtasks */
  subtaskCompletedCount: number;
  /** Whether this was a habit task */
  isHabit: boolean;
  /** ISO date string of when this record was logged (auto-expire time) */
  loggedAt: string;
}
