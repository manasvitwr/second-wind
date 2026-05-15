import React, { useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import './styles/global.css';
import NavBar from './components/NavBar/NavBar';
import TaskTree from './components/TaskTree/TaskTree';
import AnalyticsPage from './components/Analytics/Analytics';

import Settings from './components/Settings/Settings';
import Footer from './components/Footer/Footer';

import Toast from './components/Toast/Toast';
import { useTasks } from './hooks/useTasks';
import { useHabits } from './hooks/useHabits';
import { useMediaQuery } from './hooks/useMediaQuery';
import type { Task } from './lib/types';
import settingsIcon from './assets/icons/settings.svg';

const App: React.FC = () => {
  const { tasks, filter, setFilter, addTask, toggleTask, editTask, deleteTask, restoreTask } = useTasks();
  const { habits, addHabit, editHabit, deleteHabit, toggleHabit } = useHabits();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const [isSettingsMode, setIsSettingsMode] = useState(false);
  const [toastState, setToastState] = useState<{
    isVisible: boolean;
    message: string;
    deletedTask: Task | null;
    parentId?: string;
  }>({
    isVisible: false,
    message: '',
    deletedTask: null,
  });

  const handleDeleteTask = (taskId: string, parentId?: string) => {
    // Helper to find task
    const findTask = (list: Task[], id: string): Task | undefined => {
      for (const t of list) {
        if (t.id === id) return t;
        if (t.children) {
          const found = findTask(t.children, id);
          if (found) return found;
        }
      }
      return undefined;
    };

    const taskToDelete = findTask(tasks, taskId);

    if (taskToDelete) {
      setToastState({
        isVisible: true,
        message: parentId ? "Subtask deleted" : "Task deleted",
        deletedTask: taskToDelete,
        parentId
      });
      deleteTask(taskId, parentId);
    }
  };

  const handleUndo = () => {
    if (toastState.deletedTask) {
      restoreTask(toastState.deletedTask, toastState.parentId);
      setToastState(prev => ({ ...prev, isVisible: false }));
    }
  };

  const toggleSettings = () => {
    setIsSettingsMode(prev => !prev);
  };

  return (
    <div className=
      "min-h-screen w-full flex flex-col bg-gradient-to-b from-black to-black p-4 md:p-8 gap-4 md:gap-9 overflow-x-hidden">

      <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full">
        {/* Title area with morph transition */}
        <div className="px-2 mb-3 mt-4 flex items-center justify-between">
          <h1
            className="app-title text-2xl md:text-4xl transition-all duration-500 ease-out"
            style={{
              opacity: 1,
              transform: isSettingsMode ? 'translateY(0px)' : 'translateY(0px)',
            }}
          >
            {isSettingsMode ? (
              '/ SETTINGS'
            ) : (
              '/ SECONDWIND'
            )}
          </h1>
          {isSettingsMode && (
            <button
              className="bg-transparent border-none cursor-pointer p-1 transition-all duration-300"
              onClick={toggleSettings}
              aria-label="Close settings"
              title="Back to tasks"
            >
              <img
                src={settingsIcon}
                alt=""
                className="w-5 h-5 md:w-6 md:h-6 opacity-50 hover:opacity-80 transition-opacity duration-300"
              />
            </button>
          )}
        </div>

        <NavBar
          currentFilter={filter}
          onFilterChange={setFilter}
          onAddTask={addTask}
          isMobile={isMobile}
          isSettingsMode={isSettingsMode}
          onToggleSettings={toggleSettings}
        />

        {/* Content area with crossfade */}
        <div className="relative flex-1">
          {/* Task/Habit content */}
          <div
            className="transition-all duration-400 ease-out"
            style={{
              opacity: isSettingsMode ? 0 : 1,
              transform: isSettingsMode ? 'translateY(12px)' : 'translateY(0px)',
              pointerEvents: isSettingsMode ? 'none' : 'auto',
              position: isSettingsMode ? 'absolute' : 'relative',
              width: '100%',
            }}
          >
            {filter === 'analytics' ? (
              <AnalyticsPage />
            ) : (
              <TaskTree
                tasks={tasks}
                filter={filter}
                onToggleTask={toggleTask}
                onEditTask={editTask}
                onDeleteTask={handleDeleteTask}
                onAddTask={addTask}
                isMobile={isMobile}
              />
            )}
          </div>

          {/* Settings content */}
          <div
            className="transition-all duration-400 ease-out"
            style={{
              opacity: isSettingsMode ? 1 : 0,
              transform: isSettingsMode ? 'translateY(0px)' : 'translateY(-12px)',
              pointerEvents: isSettingsMode ? 'auto' : 'none',
              position: isSettingsMode ? 'relative' : 'absolute',
              top: isSettingsMode ? undefined : 0,
              width: '100%',
            }}
          >
            <Settings
              habits={habits}
              onAddHabit={addHabit}
              onEditHabit={editHabit}
              onDeleteHabit={deleteHabit}
              onToggleHabit={toggleHabit}
              isMobile={isMobile}
            />
          </div>
        </div>
      </div>
      <Footer isMobile={isMobile} />



      <Toast
        message={toastState.message}
        isVisible={toastState.isVisible}
        onUndo={handleUndo}
        onClose={() => setToastState(prev => ({ ...prev, isVisible: false }))}
      />

      <Analytics />
    </div>
  );
};

export default App;

