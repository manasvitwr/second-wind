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
    const habitDefinitions = localStorageService.getHabits();
    const today = localStorageService.getTodayDateString();
    const yesterday = localStorageService.getYesterdayDateString();
    
    const habitTasks: Task[] = habitDefinitions.filter(h => h.isActive).map(habit => {
      const todayTaskId = `habit-${habit.id}-${today}`;
      const yesterdayTaskId = `habit-${habit.id}-${yesterday}`;
      
      const savedTodayTask = loadedTasks.find(t => t.id === todayTaskId);
      const savedYesterdayTask = loadedTasks.find(t => t.id === yesterdayTaskId);
      
      const task: Task = {
        id: todayTaskId,
        title: habit.title,
        completed: habit.lastCompletedDate === today,
        isHabit: true,
        createdAt: savedTodayTask?.createdAt || new Date(),
        children: []
      };
      
      if (savedTodayTask) {
        task.children = savedTodayTask.children || [];
      } else if (savedYesterdayTask && !savedYesterdayTask.completed) {
        task.children = savedYesterdayTask.children || [];
      }
      
      return task;
    });
    
    const nonHabitTasks = loadedTasks.filter(task => !task.isHabit);
    setTasks([...nonHabitTasks, ...habitTasks]);
    
    if (loadedTasks.length > 0) {
      localStorage.setItem('secondwind-tasks-backup', JSON.stringify(loadedTasks));
    }
    
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!isInitialized) {
      return;
    }
    
    // Save all tasks including habits to persist subtasks
    localStorageService.saveTasks(tasks);
  }, [tasks, isInitialized]);

  useEffect(() => {
    const handleAddHabitTask = (event: CustomEvent) => {
      const habitTask = event.detail;
      setTasks(prev => [...prev, habitTask]);
    };

    const handleHabitsUpdated = () => {
      localStorageService.regenerateDailyHabitsIfNeeded();
      const habitDefinitions = localStorageService.getHabits();
      const today = localStorageService.getTodayDateString();
      const yesterday = localStorageService.getYesterdayDateString();
      
      setTasks(prev => {
        const nonHabitTasks = prev.filter(task => !task.isHabit);
        const currentHabitTasks = prev.filter(task => task.isHabit);
        
        const newHabitTasks = habitDefinitions.filter(h => h.isActive).map(habit => {
          const todayTaskId = `habit-${habit.id}-${today}`;
          const yesterdayTaskId = `habit-${habit.id}-${yesterday}`;
          
          const existingTodayTask = currentHabitTasks.find(t => t.id === todayTaskId);
          const savedYesterdayTask = currentHabitTasks.find(t => t.id === yesterdayTaskId);
          
          const task: Task = {
            id: todayTaskId,
            title: habit.title,
            completed: habit.lastCompletedDate === today,
            isHabit: true,
            createdAt: existingTodayTask?.createdAt || new Date(),
            children: []
          };
          
          if (existingTodayTask) {
            task.children = existingTodayTask.children || [];
          } else if (savedYesterdayTask && !savedYesterdayTask.completed) {
            task.children = savedYesterdayTask.children || [];
          }
          
          return task;
        });
        
        return [...nonHabitTasks, ...newHabitTasks];
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
          if (task.isHabit) {
            const habitId = task.id.split('-')[1];
            if (habitId) {
              localStorageService.toggleHabitCompletion(habitId, newCompleted);
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
          
          const allChildrenCompleted = updatedChildren.length > 0 && updatedChildren.every(child => child.completed);
          const wasCompleted = task.completed;
          const isNowCompleted = allChildrenCompleted;
          
          if (task.isHabit && isNowCompleted && !wasCompleted) {
            const habitId = task.id.split('-')[1];
            if (habitId) {
              localStorageService.toggleHabitCompletion(habitId, true);
            }
          } else if (task.isHabit && !isNowCompleted && wasCompleted) {
            const habitId = task.id.split('-')[1];
            if (habitId) {
              localStorageService.toggleHabitCompletion(habitId, false);
            }
          }
          
          return {
            ...task,
            children: updatedChildren,
            completed: isNowCompleted,
            completedAt: isNowCompleted ? new Date() : undefined,
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
    restoreTask: (task: Task, parentId?: string) => {
      setTasks(prev => {
        if (!parentId) {
          return [...prev, task];
        }
        
        return prev.map(t => 
          t.id === parentId 
            ? { ...t, children: [...(t.children || []), task] }
            : t
        );
      });
    },
  };
}
