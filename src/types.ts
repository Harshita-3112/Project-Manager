export type StatusId = 'todo' | 'in-progress' | 'in-review' | 'completed';

export type Priority = 'Low' | 'Medium' | 'High';

export interface Status {
  id: StatusId;
  label: string;
  color: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: StatusId;
  priority: Priority;
  /** ISO date (YYYY-MM-DD) or empty string */
  dueDate: string;
}

/** A task that hasn't been saved yet has no id. */
export type TaskDraft = Omit<Task, 'id'> & { id?: string };

export interface Notification {
  id: string;
  text: string;
  time: number;
  read: boolean;
}

export type View = 'home' | 'projects' | 'inbox';
