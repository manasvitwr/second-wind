import React from 'react';

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
    if (filter === 'all') {
      return 'Add your first task using the input above';
    }
    return null;
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <p className="task-text text-lg mb-2">
        {getMessage()}
      </p>
      {getSubMessage() && (
        <p className="text-neutral-600 font-geist text-sm">
          {getSubMessage()}
        </p>
      )}
    </div>
  );
};

export default EmptyState;
