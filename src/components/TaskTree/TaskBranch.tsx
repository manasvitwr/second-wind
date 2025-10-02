import React, { useState } from 'react';
import type { Task } from '../../lib/types';
import TaskCheckbox from './TaskCheckbox';
import TaskLine from './TaskLine';
import { Edit, Trash2, Plus, Minus } from 'lucide-react';
import deleteMainSound from '../../assets/sounds/delete-main.mp3';
import deleteSubtaskSound from '../../assets/sounds/delete-subtask.mp3';
import MinitasksIcon from '../../assets/icons/minitasks.svg';

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
  isLastTask,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [isAddingSubTask, setIsAddingSubTask] = useState(false);
  const [newSubTaskTitle, setNewSubTaskTitle] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingSubTaskId, setEditingSubTaskId] = useState<string | null>(null);
  const [editSubTaskTitle, setEditSubTaskTitle] = useState('');

  const mainDeleteAudio = React.useMemo(() => new Audio(deleteMainSound), []);
  const subDeleteAudio = React.useMemo(() => new Audio(deleteSubtaskSound), []);

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
      // Entering edit mode
      if (task.isHabit) {
        onShowHabitModal();
        setIsEditMode(false);
        return;
      }
      setIsEditing(true);
      setEditTitle(task.title);
    } else {
      // Exiting edit mode - close everything
      setIsEditing(false);
      setEditingSubTaskId(null);
      setEditSubTaskTitle('');
      cancelAddSubTask(); // Close add subtask input if open
    }
  };

  const shouldShowMinitasksIcon = !isEditing && editingSubTaskId === null;

  return (
    <div className="flex flex-col gap-4 p-1 bg-transparent transition-all duration-200">
      <div className="flex items-center gap-2 relative -ml-1">
        <TaskCheckbox
          checked={task.completed}
          onChange={() => onToggleTask(task.id)}
          disabled={false}
        />        
        {isEditing ? (
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="flex-1 bg-transparent border-b border-neutral-500 rounded-none px-2 py-1 text-white text-base md:text-lg outline-none transition-colors duration-200 focus:border-neutral-300"
            onKeyPress={(e) => e.key === 'Enter' && handleEdit()}
            onBlur={handleEdit}
            autoFocus
          />
        ) : (
          <span className={`flex-1 task-text text-lg md:text-xl font-semibold  ${
            task.completed ? 'task-completed' : ''
          }`}>
            {task.title}
          </span>
        )}
        
        <div className="flex gap-2 opacity-70 transition-opacity duration-200">
          {shouldShowMinitasksIcon && (
            <button
              className="p-1 text-neutral-500 hover:text-white transition-colors rounded"
              onClick={() => setIsAddingSubTask(true)}
              title="Add subtask"
            >
              <img 
                src={MinitasksIcon} 
                alt="Add subtask" 
                className="w-5 h-5" 
              />
            </button>
          )}
          
          <button
            className="p-1 text-neutral-500 hover:text-white transition-colors rounded"
            onClick={toggleEditMode}
            title="Toggle edit mode"
          >
            <Edit size={20} />
          </button>
          
          {isEditMode && (
            <button
              className="p-1 text-red-400 hover:text-red-400 transition-colors rounded"
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
              <Trash2 size={20} />
            </button>
          )}
        </div>
      </div>

      {task.children && task.children.length > 0 && (
        <div className="flex flex-col gap-4 ml-5 mb-2 md:ml-4 mb-2 relative">
          {!isEditing && task.children.length >= 1 && !isLastTask && <TaskLine />}
          
          {task.children.map(child => (
            <div 
              key={child.id} 
              className="flex items-center gap-2 group cursor-pointer hover:bg-neutral-800/20 rounded px-1 transition-colors duration-200"
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
                  className="flex-1 bg-transparent border-b border-neutral-500 rounded-none px-2 py-1 text-white text-sm md:text-base outline-none transition-colors duration-200 focus:border-neutral-300"
                  onKeyPress={(e) => e.key === 'Enter' && handleSubTaskEdit(child.id)}
                  onBlur={() => handleSubTaskEdit(child.id)}
                  autoFocus
                />
              ) : (
                <span className={`flex-1 task-text text-base md:text-lg font-medium ${
                  child.completed ? 'task-completed' : 'text-neutral-300'
                }`}>
                  {child.title}
                </span>
              )}
              
              {isEditMode && editingSubTaskId !== child.id && (
                <button
                  className="p-1 text-red-400 hover:text-red-300 transition-colors rounded flex-shrink-0"
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
        <div className="ml-1 md:ml-4 mt-1">
          <input
            type="text"
            value={newSubTaskTitle}
            onChange={(e) => setNewSubTaskTitle(e.target.value)}
            placeholder="Enter subtask..."
            className="w-full bg-transparent border-b border-neutral-500 rounded-none px-2 py-2 text-white text-base md:text-lg outline-none transition-colors duration-200 focus:border-neutral-300"
            onKeyPress={(e) => e.key === 'Enter' && handleAddSubTask()}
            autoFocus
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleAddSubTask}
              className="px-4 py-2 text-neutral-300 text-sm rounded-lg transition-all duration-300 backdrop-blur-md bg-neutral-700/40 border border-neutral-600/50 hover:bg-neutral-600/60 hover:border-neutral-500/60 hover:shadow-lg hover:shadow-neutral-500/20 transform hover:-translate-y-0.5"
            >
              Add
            </button>
            <button
              onClick={cancelAddSubTask}
              className="px-4 py-2 text-neutral-400 text-sm rounded-lg transition-all duration-200 backdrop-blur-sm bg-neutral-800/30 border border-neutral-700/50 hover:bg-neutral-700/40 hover:text-neutral-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {isEditMode && !isAddingSubTask && (
        <button
          className="flex items-center gap-2 p-2 text-neutral-500 hover:text-white transition-colors text-sm ml-1 md:ml-4"
          onClick={() => setIsAddingSubTask(true)}
        >
          <Plus size={16} />
          Add subtask
        </button>
      )}
    </div>
  );
};

export default TaskBranch;