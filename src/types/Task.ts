export interface Task {
  id: string;
  title: string;
  completed: boolean;
  children?: Task[];
  isHabit?: boolean;
  repeatInterval?: number; // for habits (hours)
  createdAt: Date;
  completedAt?: Date;
  updatedAt?: Date; // last "touch": any edit to task or its subtasks
}

export interface TaskTreeState {
  tasks: Task[];
  filter: 'all' | 'active' | 'completed' | 'analytics';
}

// Task interface is exported above
