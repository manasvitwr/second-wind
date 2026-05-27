import type { ActivityRecord } from './types';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  children?: Task[];
  isHabit?: boolean;
  createdAt: Date;
  completedAt?: Date;
  updatedAt?: Date;
}

export interface Habit {
  id: string;
  title: string;
  lastCompletedDate?: string; // YYYY-MM-DD format
  isActive: boolean;
  streak?: number; // running streak count
  createdAt: Date; // creation date
  resetTime?: string; // HH:MM format, defaults to "04:00"
}

class LocalStorageService {
  private readonly TASKS_KEY = 'secondwind-tasks';
  private readonly HABITS_KEY = 'secondwind-habits';
  private readonly HABITS_LAST_GEN_KEY = 'secondwind-habits-last-generation-date';
  private readonly ACTIVITY_LOG_KEY = 'secondwind-activity-log';

  getTasks(): Task[] {
    try {
      const raw = localStorage.getItem(this.TASKS_KEY);
      
      if (!raw || raw === '[]' || raw === 'null' || raw.trim() === '') {
        return [];
      }

      const parsed = JSON.parse(raw);
      
      if (!Array.isArray(parsed)) {
        return [];
      }
      
      if (parsed.length === 0) {
        return [];
      }
      const simpleRevive = parsed.map(item => {
        if (!item || typeof item !== 'object') return null;
        
        const task: Task = {
          id: String(item.id || Date.now().toString()),
          title: String(item.title || 'Untitled'),
          completed: Boolean(item.completed),
          isHabit: Boolean(item.isHabit),
          createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
          completedAt: item.completedAt ? new Date(item.completedAt) : undefined,
          updatedAt: item.updatedAt ? new Date(item.updatedAt) : undefined,
          children: []
        };
        
        if (Array.isArray(item.children)) {
          task.children = item.children.map((child: any) => ({
            id: String(child.id || Date.now().toString()),
            title: String(child.title || 'Untitled'),
            completed: Boolean(child.completed),
            createdAt: child.createdAt ? new Date(child.createdAt) : new Date(),
            completedAt: child.completedAt ? new Date(child.completedAt) : undefined,
            updatedAt: child.updatedAt ? new Date(child.updatedAt) : undefined,
            children: []
          }));
        }
        
        return task;
      }).filter(Boolean);

      return simpleRevive as Task[];
      
    } catch (error) {
      return [];
    }
  }
  
  saveTasks(tasks: Task[]): void {
    try {
      if (!Array.isArray(tasks)) {
        return;
      }
      
      const serializable = tasks.map(t => ({
        ...t,
        createdAt: t.createdAt.toISOString(),
        completedAt: t.completedAt?.toISOString(),
        updatedAt: t.updatedAt?.toISOString(),
        children: t.children ? t.children.map(child => ({
          ...child,
          createdAt: child.createdAt.toISOString(),
          completedAt: child.completedAt?.toISOString(),
          updatedAt: child.updatedAt?.toISOString(),
        })) : []
      }));
      
      localStorage.setItem(this.TASKS_KEY, JSON.stringify(serializable));
      
      localStorage.setItem('secondwind-tasks-backup', JSON.stringify(serializable));
    } catch (error) {
    }
  }
  getHabits(): Habit[] {
    try {
      const stored = localStorage.getItem(this.HABITS_KEY);
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) return [];
      const habits: Habit[] = parsed.map((h: any) => ({
        id: String(h.id ?? ''),
        title: String(h.title ?? ''),
        lastCompletedDate: typeof h.lastCompletedDate === 'string' ? h.lastCompletedDate : undefined,
        isActive: h.isActive !== false,
        streak: typeof h.streak === 'number' ? h.streak : 0,
        createdAt: h.createdAt ? new Date(h.createdAt) : new Date(),
        resetTime: typeof h.resetTime === 'string' ? h.resetTime : '21:00',
      }));
      return habits;
    } catch {
      return [];
    }
  }

  saveHabits(habits: Habit[]): void {
    try {
      if (!Array.isArray(habits)) {
        return;
      }
      
      localStorage.setItem(this.HABITS_KEY, JSON.stringify(habits));
    } catch (error) {
    }
  }

  getTodayDateString(): string {
    return new Date().toISOString().split('T')[0];
  }

  getYesterdayDateString(): string {
    return new Date(Date.now() - 86400000).toISOString().split('T')[0];
  }

  private getLastGenerationDate(): string | null {
    return localStorage.getItem(this.HABITS_LAST_GEN_KEY);
  }

  private setLastGenerationDate(dateStr: string): void {
    localStorage.setItem(this.HABITS_LAST_GEN_KEY, dateStr);
  }

  regenerateDailyHabitsIfNeeded(): void {
    const today = this.getTodayDateString();
    const lastGen = this.getLastGenerationDate();
    if (lastGen === today) {
      return;
    }

    const yesterday = this.getYesterdayDateString();
    const habits = this.getHabits();

    const updatedHabits: Habit[] = habits.map(habit => {
      // If last completed was yesterday, keep the streak as is (it will be incremented today when completed)
      if (habit.lastCompletedDate === yesterday) {
        return habit;
      }

      // If last completed was today (unlikely here but for safety), keep it
      if (habit.lastCompletedDate === today) {
        return habit;
      }

      // Otherwise, they missed a day, reset streak
      return { ...habit, streak: 0 };
    });

    this.saveHabits(updatedHabits);
    this.setLastGenerationDate(today);
  }

  generateDailyHabits(): Task[] {
    const habits = this.getHabits();
    const today = this.getTodayDateString();

    return habits
      .filter(habit => habit.isActive)
      .map(habit => ({
        id: `habit-${habit.id}-${today}`,
        title: habit.title,
        completed: habit.lastCompletedDate === today,
        isHabit: true,
        createdAt: new Date(),
        children: [],
      }));
  }

  toggleHabitCompletion(habitId: string, completed: boolean): void {
    const today = this.getTodayDateString();
    const yesterday = this.getYesterdayDateString();
    const habits = this.getHabits();
    
    const updated = habits.map(habit => {
      if (habit.id !== habitId) return habit;
      
      const prevStreak = typeof habit.streak === 'number' ? habit.streak : 0;
      let newStreak = prevStreak;
      let newLastCompletedDate = habit.lastCompletedDate;

      if (completed) {
        // Completing the habit
        if (habit.lastCompletedDate === today) {
          // Already completed today, no change
          newStreak = prevStreak;
        } else if (habit.lastCompletedDate === yesterday) {
          // Continued streak
          newStreak = prevStreak + 1;
        } else {
          // Started new streak
          newStreak = 1;
        }
        newLastCompletedDate = today;
      } else {
        // Uncompleting the habit
        if (habit.lastCompletedDate === today) {
          // If we are unchecking today's completion, we need to revert the streak
          // This is tricky because we don't know if the streak was 1 or prev+1
          // But we can assume if it was completed today, the streak was incremented or set to 1.
          // Simplest is to just decrement if it was > 0, but that might be wrong if it was a fresh start.
          // Better: if we uncomplete today, lastCompletedDate becomes undefined (or yesterday if we could track it)
          // For simplicity, let's just decrement streak and clear lastCompletedDate.
          newStreak = prevStreak > 0 ? prevStreak - 1 : 0;
          newLastCompletedDate = undefined; 
        }
      }
      
      return { ...habit, lastCompletedDate: newLastCompletedDate, streak: newStreak };
    });
    
    this.saveHabits(updated);
    window.dispatchEvent(new CustomEvent('habits-updated'));
  }
  getActivityLog(): ActivityRecord[] {
    try {
      const raw = localStorage.getItem(this.ACTIVITY_LOG_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private appendActivityRecords(records: ActivityRecord[]): void {
    if (records.length === 0) return;
    try {
      const existing = this.getActivityLog();
      localStorage.setItem(this.ACTIVITY_LOG_KEY, JSON.stringify([...existing, ...records]));
    } catch {
    }
  }

  /**
   * Auto-expires completed tasks that are 2+ months old.
   * Before removal, writes an anonymous ActivityRecord for each expired task
   * so analytics data is preserved. Manual deletes do NOT call this.
   * Returns the surviving task list (call saveTasks after).
   */
  expireOldCompletedTasks(tasks: Task[]): Task[] {
    const now = new Date();
    const twoMonthsMs = 1000 * 60 * 60 * 24 * 61; // ~2 months
    const expired: ActivityRecord[] = [];
    const loggedAt = now.toISOString();

    const surviving = tasks.filter(task => {
      if (!task.completed || !task.completedAt) return true;
      const age = now.getTime() - task.completedAt.getTime();
      if (age < twoMonthsMs) return true;

      // Log anonymous activity record before dropping the task
      expired.push({
        createdAt: task.createdAt.toISOString(),
        completedAt: task.completedAt.toISOString(),
        updatedAt: task.updatedAt?.toISOString(),
        subtaskCount: task.children?.length ?? 0,
        subtaskCompletedCount: task.children?.filter(c => c.completed)?.length ?? 0,
        isHabit: Boolean(task.isHabit),
        loggedAt,
      });

      return false;
    });

    this.appendActivityRecords(expired);
    return surviving;
  }
}

export const localStorageService = new LocalStorageService();
