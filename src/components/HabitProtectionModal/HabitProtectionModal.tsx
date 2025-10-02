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
    bg-black/20 backdrop-blur-md"
  >
    {/* Grain overlay with black tint */}
    <div className="absolute inset-0 pointer-events-none z-[-1] 
      bg-[url('/grain.png')] opacity-60 mix-blend-overlay bg-[size:200px]"
    />
    
    {/* Additional black tint layer */}
    <div className="absolute inset-0 pointer-events-none z-[-2] 
      bg-gradient-to-br from-black/40 to-black/20"
    />

    <div className="relative bg-white/5 border border-white/15 shadow-2xl rounded-2xl p-6 max-w-sm mx-4
      flex flex-col items-center animate-fade-in backdrop-blur-lg
    ">
      {/* Alert icon */}
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-amber-500/20 border border-amber-400/30 mb-4">
        <svg className="w-6 h-6 text-amber-300" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      </div>

      {/* Message with icon */}
      <div className="flex items-start gap-3 mb-6">
        <h3 className="text-white text-base font-normal tracking-tight text-center drop-shadow-lg leading-relaxed">
          Habit tasks can only be edited from the Habits menu
        </h3>
      </div>

      <div className="flex gap-3 w-full justify-center items-center">
        <button
          onClick={onClose}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-normal 
            text-red-200/90 border border-red-400/30 bg-red-500/10 
            hover:bg-red-500/20 hover:text-red-100 hover:border-red-400/50
            ease-in-out transition-all duration-200 shadow-sm
            active:scale-95 active:bg-red-500/25 flex-1 justify-center"
        >
          <span>×</span>
          Cancel
        </button>
        
        <button
          onClick={handleTakeMeThere}
          className="flex items-center justify-center px-6 py-2.5 rounded-xl text-sm font-normal 
            bg-white/20 text-white border border-white/30 
            hover:bg-white/30 hover:text-white hover:border-white/40
            shadow-lg transition-all duration-200 
            active:scale-95 active:bg-white/40 active:shadow-white/20 active:shadow-inner flex-1"
        >
          Take me there
        </button>
      </div>
    </div>
  </div>
);
};
export default HabitProtectionModal;

