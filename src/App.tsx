import React, { useState } from 'react';
import './styles/global.css';
import NavBar from './components/NavBar/NavBar';
import TaskTree from './components/TaskTree/TaskTree';
import HabitList from './components/HabitList/HabitList';
import Footer from './components/Footer/Footer';
import HabitProtectionModal from './components/HabitProtectionModal/HabitProtectionModal';
import { useTasks } from './hooks/useTasks';
import { useHabits } from './hooks/useHabits';
import { useMediaQuery } from './hooks/useMediaQuery';

const App: React.FC = () => {
  const { tasks, filter, setFilter, addTask, toggleTask, editTask, deleteTask } = useTasks();
  const { habits, addHabit, editHabit, deleteHabit, toggleHabit } = useHabits();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-b from-black to-black p-4 md:p-8 gap-4 md:gap-9">

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
            onDeleteTask={deleteTask}
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
    </div>
  );
};

export default App;
