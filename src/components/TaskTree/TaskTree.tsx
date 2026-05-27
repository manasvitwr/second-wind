import React, { useState } from 'react';
import type { Task, FilterType } from '../../lib/types';
import TaskBranch from './TaskBranch';
import EmptyState from '../EmptyState/EmptyState';
import TaskSummary from './TaskSummary';
import { getActiveAgeBucket } from '../../utils/timeUtils';
import type { ActiveAgeBucket } from '../../utils/timeUtils';
import { ChevronDown } from 'lucide-react';


interface TaskTreeProps {
  tasks: Task[];
  filter: FilterType;
  onToggleTask: (taskId: string, parentId?: string) => void;
  onEditTask: (taskId: string, newTitle: string, parentId?: string) => void;
  onDeleteTask: (taskId: string, parentId?: string) => void;
  onAddTask: (title: string, parentId?: string) => void;

  isMobile: boolean;
}

const BUCKET_LABELS: Record<ActiveAgeBucket, string> = {
  today: 'TODAY',
  earlier: 'EARLIER',
  old: 'OLD',
};

const BUCKET_ORDER: ActiveAgeBucket[] = ['today', 'earlier', 'old'];

const TaskTree: React.FC<TaskTreeProps> = ({
  tasks,
  filter,
  onToggleTask,
  onEditTask,
  onDeleteTask,
  onAddTask,

  isMobile,
}) => {
  const [showSummary, setShowSummary] = useState(false);
  const [collapsedBuckets, setCollapsedBuckets] = useState<Record<string, boolean>>({});

  const toggleBucket = (bucket: string) => {
    setCollapsedBuckets(prev => ({ ...prev, [bucket]: !prev[bucket] }));
  };

  const filteredTasks = tasks.filter(task => {
    switch (filter) {
      case 'active':
        return !task.completed;
      case 'completed':
        return task.completed;

      default:
        return true;
    }
  });

  const getLatestTimestamp = (task: Task): number => {
    const own = new Date(task.createdAt).getTime();
    if (!task.children || task.children.length === 0) return own;
    const childMax = Math.max(...task.children.map(c => new Date(c.createdAt).getTime()));
    return Math.max(own, childMax);
  };

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    // 1. Completed tasks always go to the very bottom
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }

    // 2. Among active tasks, habits always take priority at the top
    if (!a.completed && a.isHabit !== b.isHabit) {
      return a.isHabit ? -1 : 1;
    }

    // 3. For active habits, apply special subtask-based sorting
    if (!a.completed && a.isHabit && b.isHabit) {
      const getMetrics = (t: Task) => {
        const children = t.children || [];
        const latestCreated = children.length > 0
          ? Math.max(...children.map(c => new Date(c.createdAt).getTime()))
          : new Date(t.createdAt).getTime();

        const latestCompleted = children.length > 0
          ? Math.max(0, ...children.map(c => c.completedAt ? new Date(c.completedAt).getTime() : 0))
          : 0;

        return { latestCreated, latestCompleted };
      };

      const metricsA = getMetrics(a);
      const metricsB = getMetrics(b);

      // Latest subtask added moves habit UP
      if (metricsA.latestCreated !== metricsB.latestCreated) {
        return metricsB.latestCreated - metricsA.latestCreated;
      }

      // Subtask done moves habit DOWN (among other active habits)
      if (metricsA.latestCompleted !== metricsB.latestCompleted) {
        return metricsA.latestCompleted - metricsB.latestCompleted;
      }
    }

    // 4. Fallback: recently created/modified tasks first
    return getLatestTimestamp(b) - getLatestTimestamp(a);
  });

  if (sortedTasks.length === 0) {
    return <EmptyState filter={filter} />;
  }

  // ── Active page: bucket-grouped rendering ──────────────────────────────────
  if (filter === 'active') {
    const activeCount = sortedTasks.length;

    const buckets: Record<ActiveAgeBucket, Task[]> = { today: [], earlier: [], old: [] };
    for (const task of sortedTasks) {
      const bucket = getActiveAgeBucket(task);
      buckets[bucket].push(task);
    }

    return (
      <div className="flex-1 px-4 md:px-8 flex flex-col">
        {/* Subheader: task count */}
        <div className="flex items-center justify-between -mb-1 px-0 md:px-3">
          <span className="text-neutral-500 text-sm font-geist-mono flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-neutral-500 shrink-0" />
            {activeCount} tasks remaining
          </span>
        </div>

        {/* Bucket sections */}
        {BUCKET_ORDER.map(bucket => {
          const bucketTasks = buckets[bucket];
          if (bucketTasks.length === 0) return null;
          const isCollapsed = collapsedBuckets[bucket] ?? false;

          return (
            <div key={bucket} className="mb-2">
              {/* Bucket header */}
              <button
                className="w-full flex items-center gap-3 py-2 px-0 md:px-3 bg-transparent border-none cursor-pointer group"
                onClick={() => toggleBucket(bucket)}
                aria-label={`${isCollapsed ? 'Expand' : 'Collapse'} ${BUCKET_LABELS[bucket]}`}
              >
                <span className="text-neutral-500 text-xs font-geist-mono font-bold tracking-wider shrink-0">
                  {BUCKET_LABELS[bucket]}
                </span>
                <div className="flex-1 h-[1px] bg-neutral-800" />
                <span className="bg-neutral-800 px-2 py-0.5 text-xs rounded text-neutral-400 font-geist-mono shrink-0">
                  {bucketTasks.length}
                </span>
                <ChevronDown
                  size={16}
                  className={`text-neutral-500 transition-transform duration-300 ease-out shrink-0 ${isCollapsed ? '-rotate-90' : 'rotate-0'}`}
                />
              </button>

              {/* Bucket tasks */}
              {!isCollapsed && (
                <div className="flex flex-col">
                  {bucketTasks.map((task, index) => (
                    <TaskBranch
                      key={task.id}
                      task={task}
                      onToggleTask={onToggleTask}
                      onEditTask={onEditTask}
                      onDeleteTask={onDeleteTask}
                      onAddSubTask={onAddTask}
                      isMobile={isMobile}
                      isLastTask={index === bucketTasks.length - 1}
                      isActivePage
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // ── Default rendering (View All / Completed) ──────────────────────────────
  return (
    <div className="flex-1 px-4 md:px-8 flex flex-col">
      <div className="relative mb-0 -ml-2">
        <h2 className="section-title text-xl md:text-2xl inline-flex items-center leading-tight">
          <span className="underline decoration-white underline-offset-[6px] pb-0">
            Tasks
          </span>
          <button
            className="summary-trigger p-0 bg-transparent border-none cursor-pointer transition-all duration-200 ease-out"
            onClick={() => setShowSummary(prev => !prev)}
            aria-label={showSummary ? 'Hide task summary' : 'Show task summary'}
            title="Task summary"
          >
            <svg
              className={`w-8 h-8 transition-all duration-200 ease-out ${showSummary ? 'text-white' : 'text-neutral-400 hover:text-neutral-200'
                }`}
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M7 10l5 5 5-5z" />
            </svg>
          </button>
        </h2>

        {showSummary && (
          <TaskSummary
            tasks={tasks}
            onClose={() => setShowSummary(false)}
          />
        )}
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

            isMobile={isMobile}
            isLastTask={index === sortedTasks.length - 1}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskTree;