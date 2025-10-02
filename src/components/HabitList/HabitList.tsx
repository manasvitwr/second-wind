import React, { useState } from 'react';
import type { Habit } from '../../lib/localStorage';
import { Plus, Edit, Trash2, Flame } from 'lucide-react';

interface HabitListProps {
  habits: Habit[];
  onAddHabit: (title: string) => void;
  onEditHabit: (id: string, title: string) => void;
  onDeleteHabit: (id: string) => void;
  onToggleHabit: (id: string) => void;
  isMobile: boolean;
}

const HabitList: React.FC<HabitListProps> = ({
  habits,
  onAddHabit,
  onEditHabit,
  onDeleteHabit,
}) => {
  const [isAddingHabit, setIsAddingHabit] = useState(false);
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [editingHabit, setEditingHabit] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const handleAddHabit = () => {
    if (newHabitTitle.trim()) {
      onAddHabit(newHabitTitle.trim());
      setNewHabitTitle('');
      setIsAddingHabit(false);
    }
  };

  const handleEditHabit = (id: string, currentTitle: string) => {
    if (editingHabit === id) {
      if (editTitle.trim() && editTitle !== currentTitle) {
        onEditHabit(id, editTitle.trim());
      }
      setEditingHabit(null);
      setEditTitle('');
    } else {
      setEditingHabit(id);
      setEditTitle(currentTitle);
    }
  };

  const isCompletedToday = (habit: Habit) => {
    const today = new Date().toISOString().split('T')[0];
    return habit.lastCompletedDate === today;
  };

  const getStreak = (habit: Habit): number => {
    const anyHabit = habit as unknown as { streak?: number };
    return typeof anyHabit.streak === 'number' ? anyHabit.streak : 0;
  };

  const formatCreationDate = (date: Date): string => {
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    return `Created on ${day}${getOrdinalSuffix(day)} ${month}`;
  };

  const getOrdinalSuffix = (day: number): string => {
    if (day >= 11 && day <= 13) {
      return 'th';
    }
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  return (
    <div className="flex-1 p-4 md:p-8 flex flex-col gap-">
      <h2 className="section-title text-lg md:text-xl mb-4 border-b-2 border-neutral-700 pb-2">
        Habits
      </h2>
      
      <div className="flex flex-col gap-4">
        {habits.map(habit => (
          <div key={habit.id} className="flex items-center gap-3 py-3 px-4 bg-neutral-800/50 rounded-lg border border-neutral-700">
            <div
              className={`px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 ${
                getStreak(habit) > 0 ? 'bg-green-700 text-white' : 'bg-neutral-700 text-neutral-200'
              }`}
              title="Current streak"
            >
              <span className="text-xs">Streak</span>
              <Flame size={12} />
              {getStreak(habit)}
            </div>
            
            <div className="flex-1">
              {editingHabit === habit.id ? (
                <input
                  type="text"
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleEditHabit(habit.id, habit.title)}
                  onBlur={() => handleEditHabit(habit.id, habit.title)}
                  className="w-full bg-neutral-700 border border-neutral-600 rounded px-2 py-1 text-white text-sm outline-none"
                  autoFocus
                />
              ) : (
                <div>
                  <span className={`task-text text-sm md:text-base ${
                    isCompletedToday(habit) ? 'task-completed' : ''
                  }`}>
                    {habit.title}
                  </span>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-xs text-neutral-500">
                      {formatCreationDate(habit.createdAt)}
                    </span>
                    {habit.lastCompletedDate && (
                      <span className="text-xs text-neutral-500">
                        Last: {new Date(habit.lastCompletedDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleEditHabit(habit.id, habit.title)}
                className="p-1 text-neutral-500 hover:text-white transition-colors"
                title="Edit habit"
              >
                <Edit size={14} />
              </button>
              <button
                onClick={() => onDeleteHabit(habit.id)}
                className="p-1 text-neutral-500 hover:text-red-400 transition-colors"
                title="Delete habit"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isAddingHabit ? (
        <div>
          <input
            type="text"
            value={newHabitTitle}
            onChange={(e) => setNewHabitTitle(e.target.value)}
            placeholder="Enter habit title..."
            className="bg-neutral-800 border border-neutral-700 rounded-md px-4 py-3 text-white text-sm md:text-base outline-none mt-4 w-full"
            onKeyPress={(e) => e.key === 'Enter' && handleAddHabit()}
            autoFocus
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleAddHabit}
              className="bg-green-600 hover:bg-green-700 border-none rounded px-4 py-2 text-white cursor-pointer transition-colors"
            >
              Add
            </button>
            <button
              onClick={() => {
                setIsAddingHabit(false);
                setNewHabitTitle('');
              }}
              className="bg-neutral-600 hover:bg-neutral-700 border-none rounded px-4 py-2 text-white cursor-pointer transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          className="flex items-center gap-2 bg-transparent border border-neutral-700 hover:border-neutral-600 rounded-md px-4 py-3 text-neutral-500 hover:text-white cursor-pointer text-sm md:text-base transition-all duration-200 mt-4"
          onClick={() => setIsAddingHabit(true)}
        >
          <Plus size={16} />
          Add New Habit
        </button>
      )}
    </div>
  );
};

export default HabitList;
