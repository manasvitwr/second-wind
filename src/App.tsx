import React, { useState } from 'react';
import './styles/global.css';
import NavBar from './components/NavBar/NavBar';
import TaskTree from './components/TaskTree/TaskTree';
import HabitList from './components/HabitList/HabitList';
import Footer from './components/Footer/Footer';
import HabitProtectionModal from './components/HabitProtectionModal/HabitProtectionModal';
import Toast from './components/Toast/Toast';
import { useTasks } from './hooks/useTasks';
import { useHabits } from './hooks/useHabits';
import { useMediaQuery } from './hooks/useMediaQuery';
import type { Task } from './lib/types';

const App: React.FC = () => {
  const { tasks, filter, setFilter, addTask, toggleTask, editTask, deleteTask, restoreTask } = useTasks();
  const { habits, addHabit, editHabit, deleteHabit, toggleHabit } = useHabits();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);
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

  return (
    <div className=
      "min-h-screen w-full flex flex-col bg-gradient-to-b from-black to-black p-4 md:p-8 gap-4 md:gap-9 overflow-x-hidden">

      <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full">
        <h1 className="app-title text-2xl px-2 md:text-4xl mb-3 mt-4">

          / SECONDWIND

        </h1>
        <NavBar
          currentFilter={filter}
          onFilterChange={setFilter}
          onAddTask={addTask}
          isMobile={isMobile}
        />
        {filter === 'habits' ? (
          <HabitList
            habits={habits}
            onAddHabit={addHabit}
            onEditHabit={editHabit}
            onDeleteHabit={deleteHabit}
            onToggleHabit={toggleHabit}
            isMobile={isMobile}
          />
        ) : (

          <TaskTree
            tasks={tasks}
            filter={filter}
            onToggleTask={toggleTask}
            onEditTask={editTask}
            onDeleteTask={handleDeleteTask}
            onAddTask={addTask}
            onShowHabitModal={() => setIsHabitModalOpen(true)}
            isMobile={isMobile}
          />
        )}
      </div>
      <Footer isMobile={isMobile} />

      <HabitProtectionModal
        isOpen={isHabitModalOpen}
        onClose={() => setIsHabitModalOpen(false)}
        onNavigateToHabits={() => setFilter('habits')}
      />

      <Toast
        message={toastState.message}
        isVisible={toastState.isVisible}
        onUndo={handleUndo}
        onClose={() => setToastState(prev => ({ ...prev, isVisible: false }))}
      />
    </div>
  );
};

export default App;
