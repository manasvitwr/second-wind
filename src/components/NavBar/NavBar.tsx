import React, { useMemo, useState } from 'react';
import type { FilterType } from '../../lib/types';
import navSwitchSound from '../../assets/sounds/nav-switch.mp3';

interface NavBarProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  onAddTask: (taskTitle: string) => void;
  isMobile: boolean;
}

const NavBar: React.FC<NavBarProps> = ({ currentFilter, onFilterChange, onAddTask }) => {
  const [newTask, setNewTask] = useState('');
  const navAudio = useMemo(() => new Audio(navSwitchSound), []);

  const handleTaskAdd = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTask.trim()) {
      onAddTask(newTask.trim());
      setNewTask('');
    }
  };

  return (
    <nav className="flex flex-col gap-0.1 -mb-3">
      {}
      {currentFilter !== 'habits' && (
        <div className="relative w-full -mb-2.2">
          <input
            type="text"
            value={newTask}
            placeholder="What needs to be done?"
            onChange={e => setNewTask(e.target.value)}
            onKeyPress={handleTaskAdd}
            className="input-placeholder bg-transparent border-b-2 border-neutral-600 text-white font-geist-mono text-2xl md:text-4xl py-3line w-full tracking-normal transition-all duration-300 focus:border-neutral-400"
          />
        </div>
      )}
      
      {/* Filter buttons with horizontal scroll */}
      <div className="flex items-center gap-0.3 md:gap-1 pb-4 overflow-x-auto scrollbar-hide whitespace-nowrap"> 
        <button
          className={`nav-text bg-none border-none font-geist-mono px-0.5 py-0.5 transition-colors duration-200 tracking-tight text-lg md:text-base flex-shrink-0 ${
            currentFilter === 'all' 
              ? 'text-white underline underline-offset-4' 
              : 'text-neutral-500 hover:text-white'
          }`}
          onClick={() => { try { navAudio.currentTime = 0; navAudio.play(); } catch {} onFilterChange('all'); }}
        >
          View All
        </button>
        <span className="text-neutral-700 text-sm md:text-base font-geist-mono mx-1 flex-shrink-0">/</span> 
        <button
          className={`nav-text bg-none border-none font-geist-mono px-0.5 py-0.5 transition-colors duration-200 tracking-tight
             text-lg md:text-base flex-shrink-0 ${
            currentFilter === 'active' 
              ? 'text-white underline underline-offset-4' 
              : 'text-neutral-500 hover:text-white'
          }`}
          onClick={() => { try { navAudio.currentTime = 0; navAudio.play(); } catch {} onFilterChange('active'); }}
        >
          Active
        </button>
        <span className="text-neutral-700 text-sm md:text-base font-geist-mono mx-1 flex-shrink-0">/</span> 
        <button
          className={`nav-text bg-none border-none font-geist-mono px-0.5 py-0.5 transition-colors duration-200 tracking-tight text-lg md:text-base flex-shrink-0 ${
            currentFilter === 'completed' 
              ? 'text-white underline underline-offset-4' 
              : 'text-neutral-500 hover:text-white'
          }`}
          onClick={() => { try { navAudio.currentTime = 0; navAudio.play(); } catch {} onFilterChange('completed'); }}
        >
          Completed
        </button>
        <span className="text-neutral-700 text-sm md:text-base font-geist-mono mx-1 flex-shrink-0">/</span> 
        <button
          className={`nav-text bg-none border-none font-geist-mono px-0.5 py-0.5 transition-colors duration-200 tracking-tight text-lg md:text-base flex-shrink-0 ${
            currentFilter === 'habits' 
              ? 'text-white underline underline-offset-4' 
              : 'text-neutral-500 hover:text-white'
          }`}
          onClick={() => { try { navAudio.currentTime = 0; navAudio.play(); } catch {} onFilterChange('habits'); }}
        >
          Habits
        </button>
      </div>
    </nav>
  );
};

export default NavBar;