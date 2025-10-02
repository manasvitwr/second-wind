import { useState, useEffect } from 'react';
import type { Task, FilterType } from '../lib/types';
import { localStorageService } from '../lib/localStorage';
import { useConfetti } from './useConfetti';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [isInitialized, setIsInitialized] = useState(false);
  const { triggerConfetti } = useConfetti();

  useEffect(() => {
    
    const directAccess = () => {
      try {
        const raw = localStorage.getItem('secondwind-tasks');
        
        if (raw && raw !== '[]' && raw !== 'null' && raw.trim() !== '') {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed.map(item => ({
              id: String(item.id),
              title: String(item.title),
              completed: Boolean(item.completed),
              isHabit: Boolean(item.isHabit),
              createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
              completedAt: item.completedAt ? new Date(item.completedAt) : undefined,
              children: Array.isArray(item.children) ? item.children.map((child: any) => ({
                id: String(child.id),
                title: String(child.title),
                completed: Boolean(child.completed),
                createdAt: child.createdAt ? new Date(child.createdAt) : new Date(),
                completedAt: child.completedAt ? new Date(child.completedAt) : undefined,
                children: []
              })) : []
            }));
          }
        }
      } catch (e) {
      }
      return null;
    };

    const serviceAccess = () => {
      try {
        const tasks = localStorageService.getTasks();
        return tasks.length > 0 ? tasks : null;
      } catch (e) {
        return null;
      }
    };

    const backupAccess = () => {
      try {
        const backup = localStorage.getItem('secondwind-tasks-backup');
        if (backup && backup !== '[]' && backup !== 'null' && backup.trim() !== '') {
          const parsed = JSON.parse(backup);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed.map(item => ({
              id: String(item.id),
              title: String(item.title),
              completed: Boolean(item.completed),
              isHabit: Boolean(item.isHabit),
              createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
              completedAt: item.completedAt ? new Date(item.completedAt) : undefined,
              children: Array.isArray(item.children) ? item.children.map((child: any) => ({
                id: String(child.id),
                title: String(child.title),
                completed: Boolean(child.completed),
                createdAt: child.createdAt ? new Date(child.createdAt) : new Date(),
                completedAt: child.completedAt ? new Date(child.completedAt) : undefined,
                children: []
              })) : []
            }));
          }
        }
      } catch (e) {
      }
      return null;
    };

    let loadedTasks = directAccess() || serviceAccess() || backupAccess() || [];
    
    localStorageService.regenerateDailyHabitsIfNeeded();
    const habits = localStorageService.generateDailyHabits();
    
    const nonHabitTasks = loadedTasks.filter(task => !task.isHabit);
    const allTasks = [...nonHabitTasks, ...habits];
    setTasks(allTasks);
    
    if (loadedTasks.length > 0) {
      localStorage.setItem('secondwind-tasks-backup', JSON.stringify(loadedTasks));
    }
    
    setIsInitialized(true);
    
  }, []);

  useEffect(() => {
    if (!isInitialized) {
      return;
    }
    
    const nonHabitTasks = tasks.filter(task => !task.isHabit);
    localStorageService.saveTasks(nonHabitTasks);
  }, [tasks, isInitialized]);

  useEffect(() => {
    const handleAddHabitTask = (event: CustomEvent) => {
      const habitTask = event.detail;
      setTasks(prev => [...prev, habitTask]);
    };

    const handleHabitsUpdated = () => {
      localStorageService.regenerateDailyHabitsIfNeeded();
      const newHabits = localStorageService.generateDailyHabits();
      setTasks(prev => {
        const nonHabitTasks = prev.filter(task => !task.isHabit);
        return [...nonHabitTasks, ...newHabits];
      });
    };

    window.addEventListener('add-habit-task', handleAddHabitTask as EventListener);
    window.addEventListener('habits-updated', handleHabitsUpdated);
    
    return () => {
      window.removeEventListener('add-habit-task', handleAddHabitTask as EventListener);
      window.removeEventListener('habits-updated', handleHabitsUpdated);
    };
  }, []);

  const addTask = (title: string, parentId?: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      completed: false,
      createdAt: new Date(),
      children: [],
    };

    setTasks(prev => {
      if (!parentId) {
        return [...prev, newTask];
      }
      
      return prev.map(task => 
        task.id === parentId 
          ? { ...task, children: [...(task.children || []), newTask] }
          : task
      );
    });
  };

  const toggleTask = (taskId: string, parentId?: string) => {
    setTasks(prev => {
      return prev.map(task => {
        if (task.id === taskId) {
          const newCompleted = !task.completed;
          if (task.isHabit && newCompleted) {
            const habitId = task.id.split('-')[1];
            if (habitId) {
              localStorageService.markHabitCompleted(habitId);
            }
          }
          if (!task.isHabit && newCompleted) {
            triggerConfetti();
            window.dispatchEvent(new CustomEvent('task-completed'));
          }
          return {
            ...task,
            completed: newCompleted,
            completedAt: newCompleted ? new Date() : undefined,
          };
        }
        
        if (task.children && parentId === task.id) {
          const updatedChildren = task.children.map(child =>
            child.id === taskId
              ? {
                  ...child,
                  completed: !child.completed,
                  completedAt: !child.completed ? new Date() : undefined,
                }
              : child
          );
          
          const allChildrenCompleted = updatedChildren.every(child => child.completed);
          
          return {
            ...task,
            children: updatedChildren,
            completed: allChildrenCompleted && updatedChildren.length > 0,
            completedAt: allChildrenCompleted && updatedChildren.length > 0 ? new Date() : undefined,
          };
        }
        
        return task;
      });
    });
  };

  const editTask = (taskId: string, newTitle: string, parentId?: string) => {
    setTasks(prev => {
      return prev.map(task => {
        if (task.id === taskId) {
          return { ...task, title: newTitle };
        }
        
        if (task.children && parentId === task.id) {
          return {
            ...task,
            children: task.children.map(child =>
              child.id === taskId ? { ...child, title: newTitle } : child
            ),
          };
        }
        
        return task;
      });
    });
  };

  const deleteTask = (taskId: string, parentId?: string) => {
    setTasks(prev => {
      if (!parentId) {
        return prev.filter(task => task.id !== taskId);
      }
      
      return prev.map(task =>
        task.id === parentId
          ? { ...task, children: (task.children || []).filter(child => child.id !== taskId) }
          : task
      );
    });
  };

  return {
    tasks,
    filter,
    setFilter,
    addTask,
    toggleTask,
    editTask,
    deleteTask,
  };
}
