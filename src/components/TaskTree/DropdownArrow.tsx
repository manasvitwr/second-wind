import React, { useState } from 'react';

interface DropdownArrowProps {
  isExpanded: boolean;
  onToggle: () => void;
  className?: string;
}

const DropdownArrow: React.FC<DropdownArrowProps> = ({ 
  isExpanded, 
  onToggle, 
  className = "" 
}) => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <button
      className={`w-11 h-11 flex items-center justify-center rounded-full transition-all duration-300 ease-out ${className}`}
      onClick={onToggle}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      aria-label={isExpanded ? "Collapse subtasks" : "Expand subtasks"}
      title={isExpanded ? "Collapse subtasks" : "Expand subtasks"}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`transition-transform duration-300 ease-out ${
          isExpanded ? 'rotate-90' : 'rotate-0'
        } ${isHovering ? 'text-white' : 'text-neutral-400'}`}
      >
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </button>
  );
};

export default DropdownArrow;