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
      className={`w-5 h-5 border-2 rounded flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
        disabled 
          ? 'cursor-not-allowed border-neutral-700' 
          : 'cursor-pointer hover:border-neutral-400'
      } ${
        checked 
          ? 'bg-gray-600 border-gray-600' 
          : 'bg-transparent border-neutral-600'
      }`}
      onClick={!disabled ? onChange : undefined}
    >
      {checked && <Check size={12} color="white" />}
    </div>
  );
};

export default TaskCheckbox;
