import React from 'react';

interface HabitProtectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToHabits: () => void;
}

const HabitProtectionModal: React.FC<HabitProtectionModalProps> = ({
  isOpen,
  onClose,
  onNavigateToHabits,
}) => {
  if (!isOpen) return null;

  const handleTakeMeThere = () => {
    onNavigateToHabits();
    onClose();
  };

return (
  <div className="fixed inset-0 z-50 flex items-center justify-center
    bg-black/30 backdrop-blur-3xl before:content-[''] before:absolute before:inset-0
    before:pointer-events-none before:z-[-1] before:bg-[url('/grain.png')] before:opacity-50"
  >
    <div className="relative bg-white/10 border border-neutral-700 shadow-xl rounded-2xl p-8 max-w-md mx-4
      flex flex-col items-center animate-fade-in backdrop-blur-xl
    ">
      <span className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-1 rounded-full bg-gradient-to-r from-white/40 to-transparent blur-lg opacity-70" />

      <h3 className="text-white text-lg font-bold mb-3 tracking-tight text-center drop-shadow-md">
        Habit tasks can only be edited from the Habits menu
      </h3>

      <div className="flex gap-4 mt-2 w-full justify-center">
        <button
          onClick={onClose}
          className="px-5 py-2 rounded-lg text-sm font-semibold text-neutral-300 border border-neutral-500
            bg-transparent hover:bg-neutral-700/10 ease-in transition-all duration-150 shadow-none"
        >
          Cancel
        </button>
        <button
          onClick={handleTakeMeThere}
          className="px-5 py-2 rounded-lg text-sm font-semibold bg-white/15 text-white
            border border-white/20 hover:bg-neutral-300/20 hover:text-neutral-100
            shadow-md transition-all duration-200 
            focus:outline-none focus:ring-2 focus:ring-neutral-200/40"
        >
          Take me there
        </button>
      </div>
    </div>
  </div>
);
};

export default HabitProtectionModal;

