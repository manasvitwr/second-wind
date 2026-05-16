import React, { useState, useEffect, useCallback } from 'react';
import type { Habit } from '../../lib/localStorage';

interface SettingsProps {
  habits: Habit[];
  onAddHabit: (title: string, resetTime?: string) => void;
  onEditHabit: (id: string, title: string, resetTime?: string) => void;
  onDeleteHabit: (id: string) => void;
  onToggleHabit: (id: string) => void;
  isMobile: boolean;
}

interface SectionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, defaultOpen = false, children }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="mb-1">
      <button
        className="flex items-center gap-2 w-full text-left bg-transparent border-none cursor-pointer group py-2"
        onClick={() => setIsOpen(prev => !prev)}
      >
        <span className="text-neutral-500 font-geist-mono text-xs transition-transform duration-200 inline-block"
          style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
        >
          ▶
        </span>
        <span className="font-geist-mono font-medium text-sm md:text-base text-white tracking-tight">
          {title}
        </span>
      </button>

      <div
        className="overflow-hidden transition-all duration-300 ease-out"
        style={{
          maxHeight: isOpen ? '2000px' : '0px',
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div className="pl-5 border-l border-neutral-800 ml-1 pb-3">
          {children}
        </div>
      </div>
    </div>
  );
};

const ToggleRow: React.FC<{
  label: string;
  value: boolean;
  onChange: (val: boolean) => void;
}> = ({ label, value, onChange }) => (
  <div className="flex items-center justify-between py-1.5 group">
    <span className="font-geist-mono text-sm text-neutral-400">{label}</span>
    <button
      className="font-geist-mono text-sm bg-transparent border border-neutral-700 px-2.5 py-0.5 cursor-pointer transition-all duration-200 hover:border-neutral-500 min-w-[60px] text-center"
      style={{ color: value ? '#e5e5e5' : '#525252' }}
      onClick={() => onChange(!value)}
    >
      [ {value ? 'ON' : 'OFF'} ]
    </button>
  </div>
);

const HOURS_12 = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
const MINUTES = ['00', '15', '30', '45'];

const formatResetTime = (resetTime?: string) => {
  const rt = resetTime || '04:00';
  const [h, m] = rt.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${String(h12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${period}`;
};

const to24h = (hour: string, minute: string, period: string) => {
  let h = parseInt(hour, 10);
  if (period === 'AM' && h === 12) h = 0;
  if (period === 'PM' && h !== 12) h += 12;
  return `${String(h).padStart(2, '0')}:${minute}`;
};

const Settings: React.FC<SettingsProps> = ({
  habits,
  onAddHabit,
  onEditHabit,
  onDeleteHabit,
  onToggleHabit,
  isMobile,
}) => {
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const stored = localStorage.getItem('secondwind-sound');
    return stored !== 'false';
  });
  const [autoCollapse, setAutoCollapse] = useState(() => {
    const stored = localStorage.getItem('secondwind-auto-collapse');
    return stored !== 'false';
  });
  const [showCompletedCount, setShowCompletedCount] = useState(() => {
    const stored = localStorage.getItem('secondwind-show-completed-count');
    return stored === 'true';
  });
  const [confirmBeforeDelete, setConfirmBeforeDelete] = useState(() => {
    const stored = localStorage.getItem('secondwind-confirm-delete');
    return stored !== 'false';
  });

  const [isAddingHabit, setIsAddingHabit] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [newResetHour, setNewResetHour] = useState('09');
  const [newResetMinute, setNewResetMinute] = useState('00');
  const [newResetPeriod, setNewResetPeriod] = useState('PM');
  const [editingHabitId, setEditingHabitId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [countdown, setCountdown] = useState('');
  const [countdownHabit, setCountdownHabit] = useState('');

  const computeCountdown = useCallback(() => {
    if (habits.length === 0) {
      setCountdown('no habits configured');
      return;
    }
    const now = new Date();
    let nearest = Infinity;
    let nearestTitle = '';

    habits.forEach(habit => {
      const rt = habit.resetTime || '04:00';
      const [hours, minutes] = rt.split(':').map(Number);
      const resetToday = new Date(now);
      resetToday.setHours(hours, minutes, 0, 0);

      let nextReset = resetToday;
      if (now >= resetToday) {
        nextReset = new Date(resetToday);
        nextReset.setDate(nextReset.getDate() + 1);
      }

      const diff = nextReset.getTime() - now.getTime();
      if (diff < nearest) {
        nearest = diff;
        nearestTitle = habit.title;
      }
    });

    if (nearest < Infinity) {
      const h = Math.floor(nearest / 3600000);
      const m = Math.floor((nearest % 3600000) / 60000);
      setCountdown(`next reset in ${h}h ${m}m`);
      setCountdownHabit(nearestTitle);
    }
  }, [habits]);

  useEffect(() => {
    computeCountdown();
    const interval = setInterval(computeCountdown, 60000);
    return () => clearInterval(interval);
  }, [computeCountdown]);

  const handleSoundToggle = (val: boolean) => {
    setSoundEnabled(val);
    localStorage.setItem('secondwind-sound', String(val));
  };

  const handleAutoCollapseToggle = (val: boolean) => {
    setAutoCollapse(val);
    localStorage.setItem('secondwind-auto-collapse', String(val));
  };

  const handleShowCompletedCountToggle = (val: boolean) => {
    setShowCompletedCount(val);
    localStorage.setItem('secondwind-show-completed-count', String(val));
  };

  const handleConfirmDeleteToggle = (val: boolean) => {
    setConfirmBeforeDelete(val);
    localStorage.setItem('secondwind-confirm-delete', String(val));
  };

  const handleAddHabit = () => {
    if (newHabitName.trim()) {
      const resetTime24 = to24h(newResetHour, newResetMinute, newResetPeriod);
      onAddHabit(newHabitName.trim(), resetTime24);
      setNewHabitName('');
      setNewResetHour('09');
      setNewResetMinute('00');
      setNewResetPeriod('PM');
      setIsAddingHabit(false);
    }
  };

  const handleEditStart = (habit: Habit) => {
    setEditingHabitId(habit.id);
    setEditTitle(habit.title);
  };

  const handleEditSave = (id: string, currentResetTime?: string) => {
    if (editTitle.trim()) {
      onEditHabit(id, editTitle.trim(), currentResetTime);
    }
    setEditingHabitId(null);
    setEditTitle('');
  };

  const isCompletedToday = (habit: Habit) => {
    const today = new Date().toISOString().split('T')[0];
    return habit.lastCompletedDate === today;
  };

  const getStreak = (habit: Habit) => typeof habit.streak === 'number' ? habit.streak : 0;

  const [streakFreezeCount, setStreakFreezeCount] = useState(() => {
    const stored = localStorage.getItem('secondwind-streak-freeze-count');
    return stored ? parseInt(stored, 10) : 1;
  });
  const [isEditingFreeze, setIsEditingFreeze] = useState(false);

  const handleFreezeCountChange = (val: number) => {
    const clamped = Math.max(1, Math.min(10, val));
    setStreakFreezeCount(clamped);
    localStorage.setItem('secondwind-streak-freeze-count', String(clamped));
  };

  const cycleResetTime = (habit: Habit) => {
    const rt = habit.resetTime || '04:00';
    const [h] = rt.split(':').map(Number);
    const nextH = (h + 1) % 24;
    const newTime = `${String(nextH).padStart(2, '0')}:00`;
    onEditHabit(habit.id, habit.title, newTime);
  };

  return (
    <div className="flex-1 px-4 md:px-8 flex flex-col pt-2">
      <div className="max-w-lg">
        <Section title="Sound" defaultOpen={false}>
          <ToggleRow label="Sound" value={soundEnabled} onChange={handleSoundToggle} />
        </Section>


        <div className="border-t border-neutral-800/50 ml-6" />

        <Section title="Habits" defaultOpen={true}>
          <div className="mb-3">
            <span className="font-geist-mono text-[11px] text-neutral-600 tracking-widest uppercase">
              NEXT RESET
            </span>
            <div className="font-geist-mono text-[11px] text-neutral-700 -my-3">
              ------------
            </div>
            <div className="font-geist-mono text-sm text-neutral-400 mt-2">
              {countdown}
              {countdownHabit && (
                <span className="font-geist-mono text-[11px] text-neutral-600 ml-1">({countdownHabit})</span>
              )}
            </div>
          </div>

          <div className="mb-4">
            <span className="font-geist-mono text-[11px] text-neutral-600 tracking-widest uppercase">
              STREAK FREEZE
            </span>
            <div className="font-geist-mono text-[11px] text-neutral-700 -my-3">
              ---------------
            </div>
            <div className="flex items-center justify-between flex-wrap gap-2 mt-3">
              <div className="flex items-center gap-2">
                {isEditingFreeze ? (
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={streakFreezeCount}
                    onChange={e => handleFreezeCountChange(parseInt(e.target.value, 10) || 1)}
                    onBlur={() => setIsEditingFreeze(false)}
                    onKeyDown={e => e.key === 'Enter' && setIsEditingFreeze(false)}
                    className="font-geist-mono text-sm text-white bg-transparent border-b border-neutral-600 outline-none w-10 text-center py-0.5"
                    autoFocus
                  />
                ) : (
                  <span className="font-geist-mono text-sm text-neutral-400">
                    {streakFreezeCount}/mo available
                  </span>
                )}
                <button
                  className="font-geist-mono text-xs text-neutral-600 bg-transparent border-none cursor-pointer underline hover:text-neutral-300 transition-colors duration-200"
                  onClick={() => setIsEditingFreeze(prev => !prev)}
                >
                  edit
                </button>
              </div>
              <button className="font-geist-mono text-sm bg-transparent border border-neutral-700 px-2.5 py-0.5 text-neutral-300 cursor-pointer transition-all duration-200 hover:border-neutral-500 hover:text-white">
                [ USE ]
              </button>
            </div>
          </div>

          <div className="mb-3">
            <span className="font-geist-mono text-[11px] text-neutral-600 tracking-widest uppercase">
              HABITS
            </span>
            <div className="font-geist-mono text-[11px] text-neutral-700 -my-2.5">
              -------        </div>
          </div>

          <div className="flex flex-col gap-2">
            {habits.map(habit => (
              <div key={habit.id} className="flex items-start gap-3 py-1.5 group">
                <button
                  className="mt-0.5 flex-shrink-0 bg-transparent border-none cursor-pointer p-0"
                  onClick={() => onToggleHabit(habit.id)}
                  aria-label={`Toggle ${habit.title}`}
                >
                  <span className="font-geist-mono text-base text-neutral-500">
                    {isCompletedToday(habit) ? '◉' : '○'}
                  </span>
                </button>

                <div className="flex-1 min-w-0">
                  {editingHabitId === habit.id ? (
                    <input
                      type="text"
                      value={editTitle}
                      onChange={e => setEditTitle(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleEditSave(habit.id)}
                      onBlur={() => handleEditSave(habit.id)}
                      className="font-geist-mono text-sm text-white bg-transparent border-b border-neutral-600 outline-none w-full py-0.5"
                      autoFocus
                    />
                  ) : (
                    <>
                      <span className={`font-geist-mono text-sm ${isCompletedToday(habit) ? 'text-neutral-600' : 'text-neutral-200'}`}>
                        {habit.title}
                      </span>
                      <div className="font-geist-mono text-[11px] text-neutral-600 mt-0.5 flex gap-3 flex-wrap">
                        <span>streak: {getStreak(habit)}</span>
                        <span>best: {getStreak(habit)}</span>
                        <button
                          className="text-neutral-600 hover:text-neutral-400 bg-transparent border-none cursor-pointer p-0 font-geist-mono text-[11px] transition-colors duration-200"
                          onClick={() => cycleResetTime(habit)}
                          title="Click to cycle reset hour"
                        >
                          reset: {formatResetTime(habit.resetTime)}
                        </button>
                      </div>
                    </>
                  )}
                </div>

                <div className={`flex items-center gap-2 flex-shrink-0 ${isMobile ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-colors duration-200`}>
                  <button
                    className="font-geist-mono text-xs text-neutral-600 bg-transparent border-none cursor-pointer underline hover:text-neutral-300"
                    onClick={() => handleEditStart(habit)}
                  >
                    edit
                  </button>
                  <button
                    className="font-geist-mono text-xs text-neutral-600 bg-transparent border-none cursor-pointer underline hover:text-red-400"
                    onClick={() => onDeleteHabit(habit.id)}
                  >
                    delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3">
            {isAddingHabit ? (
              <div className="pl-6">
                <div className="mb-2">
                  <span className="font-geist-mono text-[11px] text-neutral-600">Name</span>
                  <div className="mt-1">
                    <input
                      type="text"
                      value={newHabitName}
                      onChange={e => setNewHabitName(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleAddHabit()}
                      className="font-geist-mono text-sm text-white bg-transparent border border-neutral-700 px-2 py-1 outline-none w-full max-w-[240px] focus:border-neutral-500 transition-colors duration-200"
                      placeholder=""
                      autoFocus
                    />
                  </div>
                </div>
                <div className="mb-2">
                  <span className="font-geist-mono text-[11px] text-neutral-600">Reset Time</span>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="font-geist-mono text-sm text-neutral-500">[</span>
                    <select
                      value={newResetHour}
                      onChange={e => setNewResetHour(e.target.value)}
                      className="font-geist-mono text-sm text-white bg-neutral-900 border border-neutral-700 px-1 py-0.5 outline-none cursor-pointer"
                    >
                      {HOURS_12.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                    <span className="font-geist-mono text-sm text-neutral-500">:</span>
                    <select
                      value={newResetMinute}
                      onChange={e => setNewResetMinute(e.target.value)}
                      className="font-geist-mono text-sm text-white bg-neutral-900 border border-neutral-700 px-1 py-0.5 outline-none cursor-pointer"
                    >
                      {MINUTES.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <select
                      value={newResetPeriod}
                      onChange={e => setNewResetPeriod(e.target.value)}
                      className="font-geist-mono text-sm text-white bg-neutral-900 border border-neutral-700 px-1 py-0.5 outline-none cursor-pointer"
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                    <span className="font-geist-mono text-sm text-neutral-500">]</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    className="font-geist-mono text-sm text-neutral-300 bg-transparent border-none cursor-pointer underline transition-colors duration-200 hover:text-white"
                    onClick={handleAddHabit}
                  >
                    Create
                  </button>
                  <button
                    className="font-geist-mono text-sm text-neutral-600 bg-transparent border-none cursor-pointer transition-colors duration-200 hover:text-neutral-400"
                    onClick={() => { setIsAddingHabit(false); setNewHabitName(''); }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                className="font-geist-mono text-sm text-neutral-500 bg-transparent border-none cursor-pointer transition-colors duration-200 hover:text-neutral-300 flex items-center gap-1"
                onClick={() => setIsAddingHabit(true)}
              >
                <span>+</span>
                <span className="underline">Add Habit</span>
              </button>
            )}
          </div>
        </Section>


        <div className="border-t border-neutral-800/50 ml-6 " />

        <Section title="Behavior" defaultOpen={false}>
          <ToggleRow label="Auto Collapse Completed" value={autoCollapse} onChange={handleAutoCollapseToggle} />
          <ToggleRow label="Show Completed Count" value={showCompletedCount} onChange={handleShowCompletedCountToggle} />
          <ToggleRow label="Confirm Before Delete" value={confirmBeforeDelete} onChange={handleConfirmDeleteToggle} />
        </Section>
      </div>
    </div>
  );
};

export default Settings;
