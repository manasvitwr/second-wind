import React, { useState } from 'react';
import type { Task } from '../../lib/types';
import TaskCheckbox from './TaskCheckbox';
import TaskLine from './TaskLine';
import { Edit, Trash2, Plus, Minus } from 'lucide-react';
import deleteMainSound from '../../assets/sounds/delete-main.mp3';
import deleteSubtaskSound from '../../assets/sounds/delete-subtask.mp3';
import MinitasksIcon from '../../assets/icons/minitasks.svg';
import DropdownArrow from './DropdownArrow';

interface TaskBranchProps {
  task: Task;
  onToggleTask: (taskId: string, parentId?: string) => void;
  onEditTask: (taskId: string, newTitle: string, parentId?: string) => void;
  onDeleteTask: (taskId: string, parentId?: string) => void;
  onAddSubTask: (title: string, parentId: string) => void;
  onShowHabitModal: () => void;
  isMobile: boolean;
  isLastTask?: boolean;
}

const TaskBranch: React.FC<TaskBranchProps> = ({
  task,
  onToggleTask,
  onEditTask,
  onDeleteTask,
  onAddSubTask,
  onShowHabitModal,
  isMobile,
  isLastTask,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [isAddingSubTask, setIsAddingSubTask] = useState(false);
  const [newSubTaskTitle, setNewSubTaskTitle] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingSubTaskId, setEditingSubTaskId] = useState<string | null>(null);
  const [editSubTaskTitle, setEditSubTaskTitle] = useState('');
  const [isHovering, setIsHovering] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true); 
  const mainDeleteAudio = React.useMemo(() => new Audio(deleteMainSound), []);
  const subDeleteAudio = React.useMemo(() => new Audio(deleteSubtaskSound), []);

  const handleToggleExpand = () => {
  setIsExpanded(!isExpanded);
  };

  const handleEdit = () => {
    if (task.isHabit) {
      onShowHabitModal();
      setIsEditing(false);
      return;
    }
    if (editTitle.trim()) {
      onEditTask(task.id, editTitle.trim());
      setIsEditing(false);
    }
  };

  const handleSubTaskEdit = (subTaskId: string) => {
    if (editSubTaskTitle.trim()) {
      onEditTask(subTaskId, editSubTaskTitle.trim(), task.id);
      setEditingSubTaskId(null);
      setEditSubTaskTitle('');
    }
  };

  const startSubTaskEdit = (subTask: Task) => {
    setEditingSubTaskId(subTask.id);
    setEditSubTaskTitle(subTask.title);
  };

  const handleAddSubTask = () => {
    if (newSubTaskTitle.trim()) {
      onAddSubTask(newSubTaskTitle.trim(), task.id);
      setNewSubTaskTitle('');
      setIsAddingSubTask(false);
    }
  };

  const cancelAddSubTask = () => {
    setIsAddingSubTask(false);
    setNewSubTaskTitle('');
  };

  const toggleEditMode = () => {
    const newEditMode = !isEditMode;
    setIsEditMode(newEditMode);
    
    if (newEditMode) {
      if (task.isHabit) {
        onShowHabitModal();
        setIsEditMode(false);
        return;
      }
      setIsEditing(true);
      setEditTitle(task.title);
    } else {
      setIsEditing(false);
      setEditingSubTaskId(null);
      setEditSubTaskTitle('');
      cancelAddSubTask();
    }
  };

  const handleTaskCompletion = () => {
    if (task.isHabit) {
      onToggleTask(task.id);
      return;
    }
  

    if (!task.completed) {

      if (task.children && task.children.length > 0) {
        task.children.forEach(child => {
          if (!child.completed) {
            onToggleTask(child.id, task.id);
          }
        });
      }
   
      onToggleTask(task.id);
    } else {
  
      onToggleTask(task.id);
   }
  };

  const shouldShowMinitasksIcon = !isEditing && editingSubTaskId === null;
  const shouldShowEditButton = isMobile ? isEditMode : isHovering;

  return (
  <div 
    className="flex flex-col p-3 bg-transparent transition-all duration-300 ease-out"
    onMouseEnter={() => !isMobile && setIsHovering(true)}
    onMouseLeave={() => !isMobile && setIsHovering(false)}
  >
    <div className="flex items-center gap-4 relative -ml-1 transition-all duration-250 ease-out">
      <TaskCheckbox
        checked={task.completed}
        onChange={handleTaskCompletion}
        disabled={false}
      />        

      {isEditing ? (
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="flex-1 bg-transparent border-b border-neutral-500 rounded-none px-2 py-1 text-white text-base md:text-lg outline-none transition-all duration-300 ease-out focus:border-neutral-300 font-geist-mono"
          onKeyPress={(e) => e.key === 'Enter' && handleEdit()}
          onBlur={handleEdit}
          autoFocus
        />
      ) : (
        <div className="flex-1 flex items-center gap-4">
          <span 
            className={`task-text text-base md:text-lg font-geist-mono font-normal transition-all duration-300 ease-out ${
              task.completed ? 'task-completed opacity-70 scale-98' : 'opacity-100 scale-100'
            }`}
            onClick={() => {
              if (isMobile && !isEditMode) {
                setIsEditMode(true);
                setIsEditing(true);
                setEditTitle(task.title);
              }
            }}
          >
            {task.title}
          </span>

          {task.isHabit && (
            <span className="bg-white/90 text-black text-[11px] px-1.5 py-0.5 rounded font-geist-mono font-medium transition-all duration-300 ease-out">
              Habit
            </span>
          )}

          {task.children && task.children.length > 0 && (
            <DropdownArrow
              isExpanded={isExpanded}
              onToggle={handleToggleExpand}
              className="-ml-4"
            />
          )}
        </div>
      )}
      
      <div className="flex gap-2 opacity-70 transition-all duration-300 ease-out">
        {shouldShowEditButton && (
          <button
            className="p-1 text-neutral-500 hover:text-white transition-all duration-250 ease-out transform hover:scale-110"
            onClick={toggleEditMode}
            title="Toggle edit mode"
          >
            <Edit size={16} />
          </button>
        )}
        
        {shouldShowMinitasksIcon && (
          <button
            className="p-1 text-neutral-500 hover:text-white transition-all duration-250 ease-out transform hover:scale-110"
            onClick={() => setIsAddingSubTask(true)}
            title="Add subtask"
          >
            <img 
              src={MinitasksIcon} 
              alt="Add subtask" 
              className="w-4 h-4 transition-transform duration-250 ease-out"
            />
          </button>
        )}
        
        <button
          className="p-1 text-red-400 hover:text-red-400 transition-all duration-250 ease-out transform hover:scale-110"
          onClick={() => {
            if (task.isHabit) {
              onShowHabitModal();
              return;
            }
            try { mainDeleteAudio.currentTime = 0; mainDeleteAudio.play(); } catch {}
            onDeleteTask(task.id);
          }}
          title="Delete task"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>

    {isExpanded && task.children && task.children.length > 0 && (
      <div className="flex flex-col gap-5 ml-7 mb-2 mt-2 md:ml-5 relative transition-all duration-300 ease-out">
        {!isEditing && task.children.length >= 1 && !isLastTask && (
          <div className="transition-all duration-300 ease-out">
            <TaskLine />
          </div>
        )}
        
        {task.children.map((child) => (
          <div 
            key={child.id} 
            className="flex items-center gap-4 group cursor-pointer hover:bg-neutral-800/20 rounded px-1 transition-all duration-300 ease-out transform hover:translate-x-1"
            onClick={() => {
              if (isEditMode && editingSubTaskId !== child.id) {
                startSubTaskEdit(child);
              }
            }}
          >
            <TaskCheckbox
              checked={child.completed}
              onChange={() => onToggleTask(child.id, task.id)}
              disabled={false}
            />
            
            {editingSubTaskId === child.id ? (
              <input
                type="text"
                value={editSubTaskTitle}
                onChange={(e) => setEditSubTaskTitle(e.target.value)}
                className="flex-1 bg-transparent border-b border-neutral-500 rounded-none px-2 py-1 text-white text-sm md:text-base outline-none transition-all duration-300 ease-out focus:border-neutral-300 font-geist-mono"
                onKeyPress={(e) => e.key === 'Enter' && handleSubTaskEdit(child.id)}
                onBlur={() => handleSubTaskEdit(child.id)}
                autoFocus
              />
            ) : (
              <span className={`flex-1 task-text text-sm md:text-base font-geist-mono font-normal transition-all duration-300 ease-out truncate ${
                child.completed ? 'task-completed opacity-60 scale-98' : 'text-neutral-300 opacity-90 scale-100'
              }`}>
                {child.title}
              </span>
            )}
            
            {isEditMode && editingSubTaskId !== child.id && (
              <button
                className="p-1 text-red-400 hover:text-red-300 transition-all duration-250 ease-out transform hover:translate-x-1 overflow-hidden"
                onClick={(e) => {
                  e.stopPropagation();
                  try { subDeleteAudio.currentTime = 0; subDeleteAudio.play(); } catch {}
                  onDeleteTask(child.id, task.id);
                }}
                title="Delete subtask"
              >
                <Minus size={14} />
              </button>
            )}
          </div>
        ))}
      </div>
    )}

    {isAddingSubTask && (
      <div className="ml-5 md:ml-5 transition-all duration-300 ease-out">
        <input
          type="text"
          value={newSubTaskTitle}
          onChange={(e) => setNewSubTaskTitle(e.target.value)}
          placeholder="Enter subtask..."
          className="w-full bg-transparent border-b border-neutral-500 rounded-none px-2 py-2 text-white text-base md:text-lg outline-none transition-all duration-300 ease-out focus:border-neutral-300 font-geist-mono"
          onKeyPress={(e) => e.key === 'Enter' && handleAddSubTask()}
          autoFocus
        />
        <div className="flex gap-3 mt-3 transition-all duration-300 ease-out">
          <button
            onClick={handleAddSubTask}
            className="px-4 py-2 text-neutral-300 text-sm rounded-lg transition-all duration-300 ease-out backdrop-blur-md bg-neutral-700/40 border border-neutral-600/50 hover:bg-neutral-600/60 hover:border-neutral-500/60 hover:shadow-lg hover:shadow-neutral-500/20 transform hover:-translate-y-0.5 font-geist-mono"
          >
            Add
          </button>
          <button
            onClick={cancelAddSubTask}
            className="px-4 py-2 text-neutral-400 text-sm rounded-lg transition-all duration-300 ease-out backdrop-blur-sm bg-neutral-800/30 border border-neutral-700/50 hover:bg-neutral-700/40 hover:text-neutral-300 font-geist-mono"
          >
            Cancel
          </button>
        </div>
      </div>
    )}

    {isEditMode && !isAddingSubTask && (
      <button
        className="flex items-center gap-2 p-2 text-neutral-500 hover:text-white transition-all duration-300 ease-out transform hover:translate-x-1 text-sm ml-2 md:ml-5 font-geist-mono"
        onClick={() => setIsAddingSubTask(true)}
      >
        <Plus size={16} className="transition-transform duration-300 ease-out" />
        Add subtask
      </button>
    )}
  </div>
  );
};

export default TaskBranch;