import React, { useEffect, useRef } from 'react';
import type { Task } from '../../lib/types';

interface TaskSummaryProps {
  tasks: Task[];
  onClose: () => void;
}

const TaskSummary: React.FC<TaskSummaryProps> = ({ tasks, onClose }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleActivity = (e: Event) => {
      // Close immediately on scroll/wheel
      if (e.type === 'scroll' || e.type === 'wheel' || e.type === 'touchmove') {
        onClose();
        return;
      }
      
      // For clicks/taps, check if outside
      const target = e.target as HTMLElement;
      if (e.type === 'mousedown' || e.type === 'touchstart') {
        if (ref.current && !ref.current.contains(target) && !target.closest('.summary-trigger')) {
          onClose();
        }
      }
    };

    document.addEventListener('mousedown', handleActivity);
    document.addEventListener('touchstart', handleActivity, { passive: true });
    window.addEventListener('scroll', handleActivity, { passive: true });
    window.addEventListener('wheel', handleActivity, { passive: true });
    window.addEventListener('touchmove', handleActivity, { passive: true });

    return () => {
      document.removeEventListener('mousedown', handleActivity);
      document.removeEventListener('touchstart', handleActivity);
      window.removeEventListener('scroll', handleActivity);
      window.removeEventListener('wheel', handleActivity);
      window.removeEventListener('touchmove', handleActivity);
    };
  }, [onClose]);

  const standaloneTasks = tasks.filter(t => !t.children || t.children.length === 0);
  const standaloneDone = standaloneTasks.filter(t => t.completed).length;
  const standaloneTotal = standaloneTasks.length;

  const allSubtasks = tasks.flatMap(t => t.children ?? []);
  const subtasksDone = allSubtasks.filter(c => c.completed).length;
  const subtasksTotal = allSubtasks.length;

  const completed = standaloneDone + subtasksDone;
  const total = standaloneTotal + subtasksTotal;
  const percentage = total > 0
    ? Math.round((completed / total) * 1000) / 10
    : 0;


  const size = 130;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = total > 0 ? completed / total : 0;
  const dashOffset = circumference * (1 - progress);

  const pointerLeft = 64;
  if (total === 0) {
    return (
      <div ref={ref} className="absolute left-0 top-full mt-3 z-50">
        <div className="relative">
          <div
            className="absolute -top-[6px] w-0 h-0"
            style={{
              left: `${pointerLeft}px`,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderBottom: '6px solid rgba(23, 23, 23, 0.97)',
            }}
          />
          <div className="bg-neutral-900/97 border border-neutral-800/60 rounded-xl px-6 py-5 backdrop-blur-md">
            <p className="text-neutral-500 text-sm font-geist-mono text-center whitespace-nowrap">
              nothing here yet — go add some tasks ↑
            </p>
          </div>
        </div>
      </div>
    );
  }

  const pctDisplay = percentage % 1 === 0
    ? `${percentage.toFixed(0)}%`
    : `${percentage.toFixed(1)}%`;

  return (
    <div ref={ref} className="absolute left-0 top-full mt-2 z-50">
      <div className="relative">

        <div
          className="absolute -top-[7px] w-0 h-0"
          style={{
            left: `${pointerLeft}px`,
            borderLeft: '7px solid transparent',
            borderRight: '7px solid transparent',
            borderBottom: '7px solid rgba(23, 23, 23, 0.97)',
          }}
        />

        <div className="bg-neutral-900/97 border border-neutral-800/60 rounded-xl p-2 backdrop-blur-md flex items-center justify-center">
          <div className="relative" style={{ width: size, height: size }}>

            <svg
              width={size}
              height={size}
              className="block"
              style={{ transform: 'rotate(-90deg)' }}
            >
              {/* Track */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth={strokeWidth}
              />
              {/* Progress arc */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="white"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                className="transition-all duration-500 ease-out"
              />
            </svg>


            <div className="absolute inset-0 flex flex-col items-center justify-center">

              <span className="text-white text-[25px] font-geist-mono font-semibold leading-none">
                {pctDisplay}
              </span>

              <div className="flex items-baseline gap-1 font-geist-mono mt-0">
                <span className="text-white text-[21px] font-semibold">{completed}</span>
                <span className="text-neutral-600 text-[16px]">/</span>
                <span className="text-white text-[21px] font-semibold">{total}</span>
              </div>

              {/* Subtask counts — size: text-[13px] | mt-0 = gap above this row */}
              {subtasksTotal > 0 && (
                <div className="flex items-baseline gap-2 font-geist-mono mt-0">
                  <span className="text-neutral-500 text-[13px]">({subtasksDone})</span>
                  <span className="text-neutral-500 text-[13px]">({subtasksTotal})</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskSummary;
