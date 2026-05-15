export interface Task {
  id: string;
  title: string;
  completed: boolean;
  children?: Task[];
  isHabit?: boolean;
  createdAt: Date;
  completedAt?: Date;
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
