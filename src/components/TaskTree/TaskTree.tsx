import React from 'react';
import type { Task, FilterType } from '../../lib/types';
import TaskBranch from './TaskBranch';
import EmptyState from '../EmptyState/EmptyState';


interface TaskTreeProps {
  tasks: Task[];
  filter: FilterType;
  onToggleTask: (taskId: string, parentId?: string) => void;
  onEditTask: (taskId: string, newTitle: string, parentId?: string) => void;
  onDeleteTask: (taskId: string, parentId?: string) => void;
  onAddTask: (title: string, parentId?: string) => void;
  onShowHabitModal: () => void;
  isMobile: boolean;
}

const TaskTree: React.FC<TaskTreeProps> = ({
  tasks,
  filter,
  onToggleTask,
  onEditTask,
  onDeleteTask,
  onAddTask,
  onShowHabitModal,
  isMobile,
}) => {
  const filteredTasks = tasks.filter(task => {
    switch (filter) {
      case 'active':
        return !task.completed;
      case 'completed':
        return task.completed;
      case 'habits':
        return task.isHabit;
      default:
        return true;
    }
  });

  const sortedTasks = filteredTasks.sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  if (sortedTasks.length === 0) {
    return <EmptyState filter={filter} />;
  }

  return (
    <div className="flex-1 px-4 md:px-8 flex flex-col">
      <div className="relative mb-2 -ml-2">
        <h2 className="section-title text-xl md:text-2xl inline-flex items-center leading-tight">
          <span className="underline decoration-white underline-offset-[6px] pb-0">
            Tasks
          </span>
          <svg 
            className="w-8 h-8 text-neutral-400" 
            viewBox="0 0 24 24" 
            fill="currentColor"
          >
            <path d="M7 10l5 5 5-5z" />
          </svg>
        </h2>
      </div>
      
      <div className="flex flex-col">
        {sortedTasks.map((task, index) => (
          <TaskBranch
            key={task.id}
            task={task}
            onToggleTask={onToggleTask}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
            onAddSubTask={onAddTask}
            onShowHabitModal={onShowHabitModal}
            isMobile={isMobile}
            isLastTask={index === sortedTasks.length - 1}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskTree;