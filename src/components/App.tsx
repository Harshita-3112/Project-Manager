'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import HomeView from './HomeView';
import ProjectsView from './ProjectsView';
import InboxView from './InboxView';
import TaskModal from './TaskModal';
import useLocalStorage from '@/hooks/useLocalStorage';
import { seedInbox, seedProjects, seedTasks, statusLabel, uid } from '@/data';
import type { Notification, Project, StatusId, Task, TaskDraft, View } from '@/types';

interface ModalState {
  /** Existing task being edited */
  task?: Task;
  /** Default status for a new task */
  status?: StatusId;
  /** Default project for a new task */
  projectId?: string;
}

export interface BoardHandlers {
  projects: Project[];
  onMove: (id: string, status: StatusId) => void;
  onOpenTask: (task: Task) => void;
  onAddTask: (status: StatusId, projectId?: string) => void;
}

export default function App() {
  const [view, setView] = useState<View>('home');
  const [projects, setProjects] = useLocalStorage<Project[]>('pm.projects', seedProjects);
  const [tasks, setTasks] = useLocalStorage<Task[]>('pm.tasks', seedTasks);
  const [inbox, setInbox] = useLocalStorage<Notification[]>('pm.inbox', seedInbox);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalState | null>(null);

  const notify = (text: string) =>
    setInbox((prev) => [{ id: uid(), text, time: Date.now(), read: false }, ...prev]);

  const projectName = (id: string) => projects.find((p) => p.id === id)?.name ?? 'Unknown project';

  const saveTask = (data: TaskDraft) => {
    if (data.id) {
      const updated = data as Task;
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      notify(`Task "${updated.title}" was updated.`);
    } else {
      const task: Task = { ...data, id: uid() };
      setTasks((prev) => [...prev, task]);
      notify(`New task "${task.title}" added to ${projectName(task.projectId)}.`);
    }
    setModal(null);
  };

  const deleteTask = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (task) notify(`Task "${task.title}" was deleted.`);
    setModal(null);
  };

  const moveTask = (id: string, status: StatusId) => {
    const task = tasks.find((t) => t.id === id);
    if (!task || task.status === status) return;
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    notify(`"${task.title}" moved to ${statusLabel(status)}.`);
  };

  const addProject = (project: Omit<Project, 'id'>): Project => {
    const p: Project = { ...project, id: uid() };
    setProjects((prev) => [...prev, p]);
    notify(`Project "${p.name}" was created.`);
    return p;
  };

  const deleteProject = (id: string) => {
    const p = projects.find((x) => x.id === id);
    setProjects((prev) => prev.filter((x) => x.id !== id));
    setTasks((prev) => prev.filter((t) => t.projectId !== id));
    if (activeProjectId === id) setActiveProjectId(null);
    if (p) notify(`Project "${p.name}" was deleted.`);
  };

  const openProject = (id: string) => {
    setActiveProjectId(id);
    setView('projects');
  };

  const unreadCount = inbox.filter((n) => !n.read).length;

  const boardProps: BoardHandlers = {
    projects,
    onMove: moveTask,
    onOpenTask: (task) => setModal({ task }),
    onAddTask: (status, projectId) => setModal({ status, projectId }),
  };

  return (
    <div className="app">
      <Sidebar
        view={view}
        onNavigate={(v) => {
          setView(v);
          if (v === 'projects') setActiveProjectId(null);
        }}
        projects={projects}
        activeProjectId={view === 'projects' ? activeProjectId : null}
        onOpenProject={openProject}
        unreadCount={unreadCount}
      />

      <main className="main">
        {view === 'home' && <HomeView tasks={tasks} {...boardProps} />}
        {view === 'projects' && (
          <ProjectsView
            tasks={tasks}
            activeProjectId={activeProjectId}
            onSelectProject={setActiveProjectId}
            onAddProject={addProject}
            onDeleteProject={deleteProject}
            {...boardProps}
          />
        )}
        {view === 'inbox' && (
          <InboxView
            inbox={inbox}
            onMarkRead={(id) => setInbox((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))}
            onMarkAllRead={() => setInbox((prev) => prev.map((n) => ({ ...n, read: true })))}
            onClear={() => setInbox([])}
          />
        )}
      </main>

      {modal && (
        <TaskModal
          task={modal.task}
          defaultStatus={modal.status}
          defaultProjectId={modal.projectId ?? activeProjectId ?? projects[0]?.id}
          projects={projects}
          onSave={saveTask}
          onDelete={deleteTask}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
