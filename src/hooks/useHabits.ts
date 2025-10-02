import { useState, useEffect } from 'react';
import type { Habit } from '../lib/localStorage';
import { localStorageService } from '../lib/localStorage';

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const savedHabits = localStorageService.getHabits();
    setHabits(savedHabits);
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!isInitialized) {
      return;
    }
    
    localStorageService.saveHabits(habits);
    window.dispatchEvent(new CustomEvent('habits-updated'));
  }, [habits, isInitialized]);

  const addHabit = (title: string) => {
    const newHabit: Habit = {
      id: Date.now().toString(),
      title,
      isActive: true,
      streak: 0,
      createdAt: new Date(),
    };
    setHabits(prev => [...prev, newHabit]);
    
    const today = new Date().toISOString().split('T')[0];
    const habitTask = {
      id: `habit-${newHabit.id}-${today}`,
      title: newHabit.title,
      completed: false,
      isHabit: true,
      createdAt: new Date(),
      children: [],
    };
    
    window.dispatchEvent(new CustomEvent('add-habit-task', { detail: habitTask }));
  };

  const editHabit = (id: string, title: string) => {
    setHabits(prev => 
      prev.map(habit => 
        habit.id === id ? { ...habit, title } : habit
      )
    );
  };

  const deleteHabit = (id: string) => {
    setHabits(prev => prev.filter(habit => habit.id !== id));
  };

  const toggleHabit = (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    setHabits(prev => 
      prev.map(habit => {
        if (habit.id !== id) return habit;
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        const prevStreak = typeof habit.streak === 'number' ? habit.streak : 0;
        let newStreak = prevStreak;
        if (habit.lastCompletedDate === today) {
          newStreak = prevStreak > 0 ? prevStreak - 1 : 0;
          return { ...habit, lastCompletedDate: undefined, streak: newStreak };
        }
        if (habit.lastCompletedDate === yesterday) {
          newStreak = prevStreak + 1;
        } else {
          newStreak = 1;
        }
        return { ...habit, lastCompletedDate: today, streak: newStreak };
      })
    );
  };

  return {
    habits,
    addHabit,
    editHabit,
    deleteHabit,
    toggleHabit,
  };
}
