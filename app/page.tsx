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
  status: AgentStatus;
  tasksCompleted: number;
  lastActive: string;
  avatar: string;
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

// Mock data
const mockAgents: Agent[] = [
  { id: '1', name: 'Data Analyst', status: 'active', tasksCompleted: 24, lastActive: '2026-02-03T14:30:00Z', avatar: 'https://placehold.co/40x40/4f46e5/white?text=DA' },
  { id: '2', name: 'Content Creator', status: 'idle', tasksCompleted: 18, lastActive: '2026-02-03T10:15:00Z', avatar: 'https://placehold.co/40x40/ec4899/white?text=CC' },
  { id: '3', name: 'Research Bot', status: 'blocked', tasksCompleted: 32, lastActive: '2026-02-02T16:45:00Z', avatar: 'https://placehold.co/40x40/0ea5e9/white?text=RB' },
  { id: '4', name: 'Customer Support', status: 'active', tasksCompleted: 42, lastActive: '2026-02-03T18:20:00Z', avatar: 'https://placehold.co/40x40/10b981/white?text=CS' },
  { id: '5', name: 'Data Processor', status: 'idle', tasksCompleted: 15, lastActive: '2026-02-03T09:30:00Z', avatar: 'https://placehold.co/40x40/f97316/white?text=DP' },
  { id: '6', name: 'Analytics Engine', status: 'active', tasksCompleted: 56, lastActive: '2026-02-03T17:45:00Z', avatar: 'https://placehold.co/40x40/8b5cf6/white?text=AE' },
];

const mockTasks: Task[] = [
  { id: '101', title: 'Analyze quarterly sales data', description: 'Process sales data for Q2 and generate reports', status: 'assigned', assignee: 'Data Analyst', priority: 'high', dueDate: '2026-02-20', tags: ['analytics', 'sales'] },
  { id: '102', title: 'Create blog content', description: 'Write 3 blog posts about AI trends', status: 'inProgress', assignee: 'Content Creator', priority: 'medium', dueDate: '2026-02-18', tags: ['content', 'blog'] },
  { id: '103', title: 'Research new AI tools', description: 'Investigate emerging AI tools for our workflow', status: 'inbox', assignee: '', priority: 'medium', tags: ['research', 'tools'] },
  { id: '104', title: 'Update customer database', description: 'Clean and update customer records', status: 'review', assignee: 'Customer Support', priority: 'low', dueDate: '2026-02-17', tags: ['database', 'cleanup'] },
  { id: '105', title: 'Generate performance metrics', description: 'Create dashboard with key performance indicators', status: 'done', assignee: 'Analytics Engine', priority: 'high', dueDate: '2026-02-15', tags: ['metrics', 'dashboard'] },
  { id: '106', title: 'Process user feedback', description: 'Analyze feedback from customer surveys', status: 'assigned', assignee: 'Data Analyst', priority: 'medium', dueDate: '2026-02-22', tags: ['feedback', 'analysis'] },
  { id: '107', title: 'Prepare data for visualization', description: 'Format data for interactive charts', status: 'inProgress', assignee: 'Data Processor', priority: 'high', dueDate: '2026-02-19', tags: ['data', 'visualization'] },
  { id: '108', title: 'Optimize API endpoints', description: 'Improve response times for key API calls', status: 'inbox', assignee: '', priority: 'medium', tags: ['api', 'performance'] },
];

const mockActivities: Activity[] = [
  { id: 'a1', agent: 'Data Analyst', action: 'completed task "Analyze quarterly sales data"', timestamp: '2026-02-03T14:30:00Z', type: 'task' },
  { id: 'a2', agent: 'Content Creator', action: 'started task "Create blog content"', timestamp: '2026-02-03T13:45:00Z', type: 'task' },
  { id: 'a3', agent: 'Customer Support', action: 'updated customer database', timestamp: '2026-02-03T12:20:00Z', type: 'task' },
  { id: 'a4', agent: 'Analytics Engine', action: 'reported performance metrics', timestamp: '2026-02-03T11:15:00Z', type: 'task' },
  { id: 'a5', agent: 'Data Analyst', action: 'changed status to active', timestamp: '2026-02-03T10:30:00Z', type: 'status' },
  { id: 'a6', agent: 'Research Bot', action: 'encountered error processing data', timestamp: '2026-02-02T16:45:00Z', type: 'notification' },
];

const mockNotifications: Notification[] = [
  { id: 'n1', message: 'You were mentioned in a task update by Data Analyst', timestamp: '2026-02-03T14:30:00Z', read: false, type: 'mention', agent: 'Data Analyst' },
  { id: 'n2', message: 'New task assigned: "Prepare data for visualization"', timestamp: '2026-02-03T13:45:00Z', read: true, type: 'system' },
  { id: 'n3', message: 'Performance alert: Data Processor exceeded CPU limit', timestamp: '2026-02-03T12:20:00Z', read: false, type: 'alert' },
  { id: 'n4', message: 'Content Creator has completed 5 tasks this week', timestamp: '2026-02-03T11:15:00Z', read: true, type: 'system' },
];

export default function Home() {
  const [agents, setAgents] = useState<Agent[]>(mockAgents);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [activities, setActivities] = useState<Activity[]>(mockActivities);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const count = notifications.filter(n => !n.read).length;
    setUnreadCount(count);
  }, [notifications]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newActivity: Activity = {
          id: `a${Date.now()}`,
          agent: agents[Math.floor(Math.random() * agents.length)].name,
          action: 'completed a task',
          timestamp: new Date().toISOString(),
          type: 'task',
        };
        setActivities(prev => [newActivity, ...prev.slice(0, 9)]);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [agents]);

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

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
            Agent Dashboard
          </h1>
          <p className="text-gray-400 mt-2">Mission Control for AI Agents</p>
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
