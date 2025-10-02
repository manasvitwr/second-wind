export interface Task {
  id: string;
  title: string;
  completed: boolean;
  children?: Task[];
  isHabit?: boolean;
  repeatInterval?: number; // for habits (hours)
  createdAt: Date;
  completedAt?: Date;
}

export interface TaskTreeState {
  tasks: Task[];
  filter: 'all' | 'active' | 'completed' | 'habits';
}

// Task interface is exported above
