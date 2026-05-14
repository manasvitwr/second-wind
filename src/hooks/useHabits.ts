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
    const handleHabitsUpdated = () => {
      setHabits(localStorageService.getHabits());
    };

    window.addEventListener('habits-updated', handleHabitsUpdated);
    return () => window.removeEventListener('habits-updated', handleHabitsUpdated);
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
    
    const today = localStorageService.getTodayDateString();
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
    const habit = habits.find(h => h.id === id);
    if (!habit) return;
    const today = localStorageService.getTodayDateString();
    const isCurrentlyCompleted = habit.lastCompletedDate === today;
    localStorageService.toggleHabitCompletion(id, !isCurrentlyCompleted);
  };

  return {
    habits,
    addHabit,
    editHabit,
    deleteHabit,
    toggleHabit,
  };
}
