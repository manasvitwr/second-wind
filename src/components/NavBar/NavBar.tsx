import React, { useMemo, useState } from 'react';
import type { FilterType } from '../../lib/types';
import navSwitchSound from '../../assets/sounds/nav-switch.mp3';
import settingsIcon from '../../assets/icons/settings.svg';

interface NavBarProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  onAddTask: (taskTitle: string) => void;
  isMobile: boolean;
  isSettingsMode: boolean;
  onToggleSettings: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ currentFilter, onFilterChange, onAddTask, isSettingsMode, onToggleSettings }) => {
  const [newTask, setNewTask] = useState('');
  const navAudio = useMemo(() => new Audio(navSwitchSound), []);

  const handleTaskAdd = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTask.trim()) {
      onAddTask(newTask.trim());
      setNewTask('');
    }
  };

  return (
    <nav className="flex flex-col px-2 gap-0.1 -mb-3">
      { }
      {currentFilter !== 'analytics' && !isSettingsMode && (
        <div className="relative w-full -mb-2.2 flex items-center">
          <input
            type="text"
            value={newTask}
            placeholder="What needs to be done?"
            onChange={e => setNewTask(e.target.value)}
            onKeyDown={handleTaskAdd}
            className="input-placeholder bg-transparent border-b-2 border-neutral-600 text-neutral-400 font-geist-mono font-normal text-2xl md:text-3xl py-3line w-full tracking-normal transition-all duration-300 focus:text-neutral-200 focus:outline-none focus:border-neutral-500 focus:placeholder-neutral-500"
          />
          <button
            className="flex-shrink-0 bg-transparent border-none cursor-pointer p-1 ml-2 transition-all duration-300 hover:opacity-80 absolute right-0 top-1/2 -translate-y-1/2"
            onClick={onToggleSettings}
            aria-label="Open settings"
            title="Settings"
          >
            <img
              src={settingsIcon}
              alt=""
              className="w-5 h-5 md:w-6 md:h-6 opacity-30 hover:opacity-60 transition-opacity duration-300"
            />
          </button>
        </div>
      )}

      <div
        className="flex items-center gap-1 md:gap-1 pb-4 whitespace-nowrap transition-all duration-400 ease-out"
        style={{
          opacity: isSettingsMode ? 0 : 1,
          maxHeight: isSettingsMode ? '0px' : '60px',
          overflow: 'hidden',
          pointerEvents: isSettingsMode ? 'none' : 'auto',
        }}
      >
        <button
          className={`nav-text bg-none border-none font-geist-mono font-normal px-0.5 py-0.5 transition-colors duration-200 tracking-tight text-sm md:text-lg flex-shrink-0 ${currentFilter === 'all'
            ? 'text-white underline underline-offset-4'
            : 'text-neutral-500 hover:text-white'
            }`}
          onClick={() => { const s = localStorage.getItem('secondwind-sound'); if (s !== 'false') { try { navAudio.currentTime = 0; navAudio.play(); } catch { } } onFilterChange('all'); }}
        >
          View All
        </button>
        <span className="text-neutral-700 text-xs md:text-sm font-geist-mono font-normal mx-1 flex-shrink-0">/</span>
        <button
          className={`nav-text bg-none border-none font-geist-mono font-normal px-0.5 py-0.5 transition-colors duration-200 tracking-tight
             text-sm md:text-lg flex-shrink-0 ${currentFilter === 'active'
              ? 'text-white underline underline-offset-4'
              : 'text-neutral-500 hover:text-white'
            }`}
          onClick={() => { const s = localStorage.getItem('secondwind-sound'); if (s !== 'false') { try { navAudio.currentTime = 0; navAudio.play(); } catch { } } onFilterChange('active'); }}
        >
          Active
        </button>
        <span className="text-neutral-700 text-xs md:text-sm font-geist-mono font-normal mx-1 flex-shrink-0">/</span>
        <button
          className={`nav-text bg-none border-none font-geist-mono font-normal px-0.5 py-0.5 transition-colors duration-200 tracking-tight text-sm md:text-lg flex-shrink-0 ${currentFilter === 'completed'
            ? 'text-white underline underline-offset-4'
            : 'text-neutral-500 hover:text-white'
            }`}
          onClick={() => { const s = localStorage.getItem('secondwind-sound'); if (s !== 'false') { try { navAudio.currentTime = 0; navAudio.play(); } catch { } } onFilterChange('completed'); }}
        >
          Completed
        </button>
        <span className="text-neutral-700 text-xs md:text-sm font-geist-mono font-normal mx-1 flex-shrink-0">/</span>
        <button
          className={`nav-text bg-none border-none font-geist-mono font-normal px-0.5 py-0.5 transition-colors duration-200 tracking-tight text-sm md:text-lg flex-shrink-0 ${currentFilter === 'analytics'
            ? 'text-white underline underline-offset-4'
            : 'text-neutral-500 hover:text-white'
            }`}
          onClick={() => { const s = localStorage.getItem('secondwind-sound'); if (s !== 'false') { try { navAudio.currentTime = 0; navAudio.play(); } catch { } } onFilterChange('analytics'); }}
        >
          Analytics
        </button>
      </div>
    </nav>
  );
};

export default NavBar;