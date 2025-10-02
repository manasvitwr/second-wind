export interface Habit {
  id: string;
  title: string;
  completed: boolean;
  repeatInterval: number; // hours
  lastCompletedAt?: Date;
  isHabit: true;
}
