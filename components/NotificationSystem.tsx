import React from 'react';
import { Notification } from '@/app/page';

interface NotificationSystemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}

const NotificationSystem: React.FC<NotificationSystemProps> = ({ notification, onMarkAsRead }) => {
  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'mention':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
          </svg>
        );
      case 'alert':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <div
      className={`flex items-start p-3 rounded-lg cursor-pointer transition-colors ${
        notification.read ? 'bg-gray-700/30' : 'bg-indigo-900/20 border-l-2 border-indigo-500'
      } hover:bg-gray-700/50`}
      onClick={() => !notification.read && onMarkAsRead(notification.id)}
    >
      <div className="flex-shrink-0 mt-0.5">
        {getIcon(notification.type)}
      </div>
      <div className="ml-3 flex-1">
        <p className={`text-sm ${notification.read ? 'text-gray-400' : 'text-gray-200'}`}>
          {notification.message}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {new Date(notification.timestamp).toLocaleString()}
        </p>
      </div>
      {!notification.read && (
        <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
      )}
    </div>
  );
};

export default NotificationSystem;
