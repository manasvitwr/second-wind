import React from 'react';
import { Check } from 'lucide-react';

interface TaskCheckboxProps {
  checked: boolean;
  onChange: () => void;
  disabled: boolean;
}

const TaskCheckbox: React.FC<TaskCheckboxProps> = ({ checked, onChange, disabled }) => {
  return (
    <div
      className={`w-4 h-4 border-2 rounded flex items-center justify-center flex-shrink-0 transition-all duration-200 ${disabled
        ? 'cursor-not-allowed border-neutral-700'
        : 'cursor-pointer hover:border-neutral-400'
        } ${checked
          ? 'bg-emerald-500 border-emerald-500'
          : 'border-white/30'
        }`}
      style={
        !checked
          ? {
            background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(0,0,0,0.8) 100%)',
            backdropFilter: 'blur(10px)',
          }
          : undefined
      }
      onClick={!disabled ? onChange : undefined}
    >
      {checked && <Check size={12} color="white" />}
    </div>
  );
};

export default TaskCheckbox;
