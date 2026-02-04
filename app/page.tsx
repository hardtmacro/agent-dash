'use client';

import React, { useState, useEffect } from 'react';
import AgentCard from '@/components/AgentCard';
import TaskBoard from '@/components/TaskBoard';
import ActivityFeed from '@/components/ActivityFeed';
import NotificationSystem from '@/components/NotificationSystem';

// Types
export type AgentStatus = 'idle' | 'active' | 'blocked';
export type TaskStatus = 'inbox' | 'assigned' | 'inProgress' | 'review' | 'done';

export interface Agent {
  id: string;
  name: string;
  role?: string;
  status: AgentStatus;
  tasksCompleted: number;
  lastActive: string;
  avatar: string;
  currentTask?: string | null;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assignee: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  tags: string[];
}

export interface Activity {
  id: string;
  agent: string;
  agentId?: string;
  action: string;
  timestamp: string;
  type: 'task' | 'status' | 'notification';
}

export interface Notification {
  id: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'mention' | 'system' | 'alert';
  agent?: string;
}

export default function Home() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch real data from API
  const fetchData = async () => {
    try {
      const response = await fetch('/api/status');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();

      setAgents(data.agents || []);
      setTasks(data.tasks || []);
      setActivities(data.activities || []);
      setLastUpdate(data.lastUpdate || '');
      setError(null);
    } catch (err) {
      setError('Failed to load agent data');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and polling
  useEffect(() => {
    fetchData();

    // Poll for updates every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const count = notifications.filter(n => !n.read).length;
    setUnreadCount(count);
  }, [notifications]);

  const handleTaskStatusChange = (taskId: string, newStatus: TaskStatus) => {
    setTasks(prev => prev.map(task => task.id === taskId ? {...task, status: newStatus} : task));
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      const newActivity: Activity = {
        id: `a${Date.now()}`,
        agent: task.assignee || 'System',
        action: `moved task "${task.title}" to ${newStatus}`,
        timestamp: new Date().toISOString(),
        type: 'task',
      };
      setActivities(prev => [newActivity, ...prev.slice(0, 9)]);
    }
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? {...n, read: true} : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({...n, read: true})));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading agent data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
              Agent Dashboard
            </h1>
            <p className="text-gray-400 mt-2">Mission Control for AI Agents</p>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-sm text-gray-400">Live</span>
            </div>
            {lastUpdate && (
              <p className="text-xs text-gray-500 mt-1">
                Updated: {new Date(lastUpdate).toLocaleTimeString()}
              </p>
            )}
            {error && (
              <p className="text-xs text-red-400 mt-1">{error}</p>
            )}
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 rounded-xl p-4 shadow-lg">
            <h3 className="text-gray-400 text-sm">Total Agents</h3>
            <p className="text-2xl font-bold mt-1">{agents.length}</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 shadow-lg">
            <h3 className="text-gray-400 text-sm">Active Agents</h3>
            <p className="text-2xl font-bold mt-1 text-green-400">{agents.filter(a => a.status === 'active').length}</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 shadow-lg">
            <h3 className="text-gray-400 text-sm">Tasks Completed</h3>
            <p className="text-2xl font-bold mt-1">{agents.reduce((sum, agent) => sum + agent.tasksCompleted, 0)}</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 shadow-lg">
            <h3 className="text-gray-400 text-sm">Unread Notifications</h3>
            <p className="text-2xl font-bold mt-1 text-red-400">{unreadCount}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-xl p-4 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Agent Status</h2>
                <div className="flex space-x-2">
                  <span className="bg-green-900/30 text-green-300 text-xs px-2 py-1 rounded">Active: {agents.filter(a => a.status === 'active').length}</span>
                  <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded">Idle: {agents.filter(a => a.status === 'idle').length}</span>
                  <span className="bg-red-900/30 text-red-300 text-xs px-2 py-1 rounded">Blocked: {agents.filter(a => a.status === 'blocked').length}</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {agents.map(agent => (
                  <AgentCard key={agent.id} agent={agent} />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-800 rounded-xl p-4 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Notifications</h2>
                {unreadCount > 0 && (
                  <button onClick={markAllNotificationsAsRead} className="text-sm text-indigo-400 hover:text-indigo-300">
                    Mark all as read
                  </button>
                )}
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {notifications.slice(0, 5).map(notification => (
                  <NotificationSystem key={notification.id} notification={notification} onMarkAsRead={markNotificationAsRead} />
                ))}
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-4 shadow-lg">
              <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {activities.map(activity => (
                  <ActivityFeed key={activity.id} activity={activity} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-gray-800 rounded-xl p-4 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Task Board</h2>
            <div className="flex space-x-2">
              <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded">Total: {tasks.length}</span>
              <span className="bg-indigo-900/30 text-indigo-300 text-xs px-2 py-1 rounded">In Progress: {tasks.filter(t => t.status === 'inProgress').length}</span>
            </div>
          </div>
          <TaskBoard tasks={tasks} onStatusChange={handleTaskStatusChange} />
        </div>
      </div>
    </div>
  );
}
