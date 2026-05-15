import React from 'react';

const TaskLine: React.FC = () => {
  return (
    <>
      {/* TASK TREE VERTICAL LINE — adjust opacity via shadow alpha or add opacity-X class to dim */}
      <div className="absolute overflow-x-hidden left-[-1.5rem] top-[0.5rem] bottom-[-1rem] w-0.5 shadow-[inset_0_0_0_2px_rgba(255,255,255,0.15)] rounded-full" />
    </>
  );
};

export default TaskLine;