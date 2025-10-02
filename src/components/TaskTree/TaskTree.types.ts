import type { Task, FilterType } from '../../lib/types';

export interface TaskTreeProps {
  tasks: Task[];
  filter: FilterType;
  onToggleTask: (taskId: string, parentId?: string) => void;
  onEditTask: (taskId: string, newTitle: string, parentId?: string) => void;
  onDeleteTask: (taskId: string, parentId?: string) => void;
  onAddTask: (title: string, parentId?: string) => void;
  onShowHabitModal: () => void;
  isMobile: boolean;
}