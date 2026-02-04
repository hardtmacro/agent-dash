import React from 'react';
import { AgentStatus } from '@/app/page';

interface StatusBadgeProps {
  status: AgentStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const styles = {
    active: 'bg-green-900/30 text-green-300 border-green-500',
    idle: 'bg-gray-700 text-gray-300 border-gray-500',
    blocked: 'bg-red-900/30 text-red-300 border-red-500',
  };

  const labels = {
    active: 'Active',
    idle: 'Idle',
    blocked: 'Blocked',
  };

  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border ${styles[status]}`}>
      {labels[status]}
    </span>
  );
};

export default StatusBadge;
