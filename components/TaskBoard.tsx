import React from 'react';
import { Task, TaskStatus } from '@/app/page';

interface TaskBoardProps {
  tasks: Task[];
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
}

const TaskBoard: React.FC<TaskBoardProps> = ({ tasks, onStatusChange }) => {
  const columns = [
    { id: 'inbox', title: 'Inbox', color: 'bg-blue-900/20' },
    { id: 'assigned', title: 'Assigned', color: 'bg-yellow-900/20' },
    { id: 'inProgress', title: 'In Progress', color: 'bg-indigo-900/20' },
    { id: 'review', title: 'Review', color: 'bg-purple-900/20' },
    { id: 'done', title: 'Done', color: 'bg-green-900/20' },
  ];

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter(task => task.status === status);
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, newStatus: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    onStatusChange(taskId, newStatus);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {columns.map(column => (
        <div
          key={column.id}
          className={`${column.color} rounded-lg p-3 min-h-[400px]`}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, column.id as TaskStatus)}
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold">{column.title}</h3>
            <span className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded-full">
              {getTasksByStatus(column.id as TaskStatus).length}
            </span>
          </div>

          <div className="space-y-3">
            {getTasksByStatus(column.id as TaskStatus).map(task => (
              <div
                key={task.id}
                draggable
                onDragStart={(e) => handleDragStart(e, task.id)}
                className="bg-gray-800 rounded-lg p-3 shadow cursor-move hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-sm">{task.title}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    task.priority === 'high' ? 'bg-red-900/30 text-red-300' :
                    task.priority === 'medium' ? 'bg-yellow-900/30 text-yellow-300' :
                    'bg-green-900/30 text-green-300'
                  }`}>
                    {task.priority}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-2 line-clamp-2">{task.description}</p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {task.tags.map(tag => (
                    <span key={tag} className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
                {task.dueDate && (
                  <div className="mt-2 flex items-center text-xs text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(task.dueDate).toLocaleDateString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskBoard;
