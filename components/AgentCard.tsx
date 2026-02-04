import React from 'react';
import { Agent } from '@/app/page';
import StatusBadge from './StatusBadge';

interface AgentCardProps {
  agent: Agent;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent }) => {
  return (
    <div className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-all duration-200 shadow-md">
      <div className="flex items-center space-x-3">
        <img src={agent.avatar} alt={agent.name} className="w-10 h-10 rounded-full border-2 border-indigo-500" />
        <div className="flex-1">
          <h3 className="font-semibold">{agent.name}</h3>
          <div className="flex items-center mt-1">
            <StatusBadge status={agent.status} />
            <span className="text-xs text-gray-400 ml-2">
              {new Date(agent.lastActive).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium">{agent.tasksCompleted}</p>
          <p className="text-xs text-gray-400">tasks</p>
        </div>
      </div>
    </div>
  );
};

export default AgentCard;
