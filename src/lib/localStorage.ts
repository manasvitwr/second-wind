export interface Task {
  id: string;
  title: string;
  completed: boolean;
  children?: Task[];
  isHabit?: boolean;
  createdAt: Date;
  completedAt?: Date;
}

export interface Habit {
  id: string;
  title: string;
  lastCompletedDate?: string; // YYYY-MM-DD format
  isActive: boolean;
  streak?: number; // running streak count
  createdAt: Date; // creation date
}

class LocalStorageService {
  private readonly TASKS_KEY = 'secondwind-tasks';
  private readonly HABITS_KEY = 'secondwind-habits';
  private readonly HABITS_LAST_GEN_KEY = 'secondwind-habits-last-generation-date';

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
          children: []
        };
        
        if (Array.isArray(item.children)) {
          task.children = item.children.map((child: any) => ({
            id: String(child.id || Date.now().toString()),
            title: String(child.title || 'Untitled'),
            completed: Boolean(child.completed),
            createdAt: child.createdAt ? new Date(child.createdAt) : new Date(),
            completedAt: child.completedAt ? new Date(child.completedAt) : undefined,
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
      if (!Array.isArray(tasks) || tasks.length === 0) {
        return;
      }
      
      const serializable = tasks.map(t => ({
        ...t,
        createdAt: t.createdAt.toISOString(),
        completedAt: t.completedAt?.toISOString(),
        children: t.children ? t.children.map(child => ({
          ...child,
          createdAt: child.createdAt.toISOString(),
          completedAt: child.completedAt?.toISOString(),
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

  private getTodayDateString(): string {
    return new Date().toISOString().split('T')[0];
  }

  private getYesterdayDateString(): string {
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
      if (habit.lastCompletedDate === yesterday) {
        return { ...habit, streak: typeof habit.streak === 'number' ? habit.streak : 0 };
      }

      if (habit.lastCompletedDate !== today) {
        return { ...habit, streak: 0 };
      }

      return { ...habit, streak: typeof habit.streak === 'number' ? habit.streak : 0 };
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
        completed: false,
        isHabit: true,
        createdAt: new Date(),
        children: [],
      }));
  }

  markHabitCompleted(habitId: string): void {
    const today = this.getTodayDateString();
    const yesterday = this.getYesterdayDateString();
    const habits = this.getHabits();
    const updated = habits.map(habit => {
      if (habit.id !== habitId) return habit;
      const prevStreak = typeof habit.streak === 'number' ? habit.streak : 0;
      let newStreak = 1;
      if (habit.lastCompletedDate === today) {
        newStreak = prevStreak;
      } else if (habit.lastCompletedDate === yesterday) {
        newStreak = prevStreak + 1;
      } else {
        newStreak = 1;
      }
      return { ...habit, lastCompletedDate: today, streak: newStreak };
    });
    this.saveHabits(updated);
    window.dispatchEvent(new CustomEvent('habits-updated'));
  }
}

export const localStorageService = new LocalStorageService();
