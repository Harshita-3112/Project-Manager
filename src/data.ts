import type { Notification, Priority, Project, Status, StatusId, Task } from './types';

export const STATUSES: Status[] = [
  { id: 'todo', label: 'To Do', color: '#64748b' },
  { id: 'in-progress', label: 'In Progress', color: '#3b82f6' },
  { id: 'in-review', label: 'In Review', color: '#f59e0b' },
  { id: 'completed', label: 'Completed', color: '#10b981' },
];

export const PRIORITIES: Priority[] = ['Low', 'Medium', 'High'];

export const PROJECT_COLORS = ['#6366f1', '#ec4899', '#14b8a6', '#f97316', '#8b5cf6', '#0ea5e9'];

export const uid = () => Math.random().toString(36).slice(2, 10);

export const statusLabel = (id: StatusId): string => STATUSES.find((s) => s.id === id)?.label ?? id;

const today = new Date();
const inDays = (n: number): string => {
  const d = new Date(today);
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

export const seedProjects: Project[] = [
  { id: 'p1', name: 'Website Redesign', description: 'Refresh the marketing site with the new brand.', color: '#6366f1' },
  { id: 'p2', name: 'Mobile App', description: 'Build the first version of the iOS & Android app.', color: '#ec4899' },
];

export const seedTasks: Task[] = [
  { id: 't1', projectId: 'p1', title: 'Collect brand assets', description: 'Logos, fonts and color palette from design team.', status: 'todo', priority: 'Medium', dueDate: inDays(3) },
  { id: 't2', projectId: 'p1', title: 'Design homepage wireframe', description: 'Low-fidelity layout for hero, features and footer.', status: 'in-progress', priority: 'High', dueDate: inDays(1) },
  { id: 't3', projectId: 'p1', title: 'Write About page copy', description: '', status: 'in-review', priority: 'Low', dueDate: inDays(5) },
  { id: 't4', projectId: 'p1', title: 'Set up hosting', description: 'Configure domain and SSL.', status: 'completed', priority: 'Medium', dueDate: inDays(-2) },
  { id: 't5', projectId: 'p2', title: 'Define MVP features', description: 'List must-have screens for v1.', status: 'todo', priority: 'High', dueDate: inDays(2) },
  { id: 't6', projectId: 'p2', title: 'Set up React Native project', description: '', status: 'in-progress', priority: 'Medium', dueDate: inDays(4) },
];

export const seedInbox: Notification[] = [
  { id: 'n1', text: 'Welcome to TaskFlow! Drag cards between columns to update their status.', time: Date.now(), read: false },
];
