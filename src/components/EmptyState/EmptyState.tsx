import React from 'react';
import ViewAllIcon from '../../assets/icons/view-all.svg';
import ActiveIcon from '../../assets/icons/active.svg';
import CompletedIcon from '../../assets/icons/completed.svg';

interface EmptyStateProps {
  filter: 'all' | 'active' | 'completed' | 'habits';
}

const EmptyState: React.FC<EmptyStateProps> = ({ filter }) => {
  const getMessage = () => {
    switch (filter) {
      case 'active':
        return 'No active tasks';
      case 'completed':
        return 'No completed tasks';
      case 'habits':
        return 'No habits yet';
      default:
        return 'Create tasks to get started';
    }
  };

  const getSubMessage = () => {
    switch (filter) {
      case 'all':
        return 'Add your first task using the input above';
      case 'habits':
        return ' + Add New Habit to track daily routines and build streaks';
      default:
        return null;
    }
  };

  const getIcon = () => {
    switch (filter) {
      case 'all':
        return ViewAllIcon;
      case 'active':
        return ActiveIcon;
      case 'completed':
        return CompletedIcon;
      case 'habits':
        return null;
      default:
        return null;
    }
  };

  const Icon = getIcon();

  return (
    <div className="flex flex-col items-center justify-center py-[200px] text-center">
      {Icon && (
        <div className="mb-3">
          <img 
            src={Icon} 
            alt="" 
            className="w-20 h-20 opacity-70"
          />
        </div>
      )}
      <p className="task-text text-lg mb-1">
        {getMessage()}
      </p>
      {getSubMessage() && (
        <p className="text-neutral-400 font-geist text-sm max-w-xs leading-relaxed">
          {getSubMessage()}
        </p>
      )}
    </div>
  );
};

export default EmptyState;