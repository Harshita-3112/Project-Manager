import { useState } from 'react';
import Sidebar from './components/Sidebar.jsx';
import HomeView from './components/HomeView.jsx';
import ProjectsView from './components/ProjectsView.jsx';
import InboxView from './components/InboxView.jsx';
import TaskModal from './components/TaskModal.jsx';
import useLocalStorage from './hooks/useLocalStorage.js';
import { seedInbox, seedProjects, seedTasks, statusLabel, uid } from './data.js';

export default function App() {
  const [view, setView] = useState('home');
  const [projects, setProjects] = useLocalStorage('pm.projects', seedProjects);
  const [tasks, setTasks] = useLocalStorage('pm.tasks', seedTasks);
  const [inbox, setInbox] = useLocalStorage('pm.inbox', seedInbox);
  const [activeProjectId, setActiveProjectId] = useState(null);
  // modal: null | { task?: existing task, status?: default status, projectId?: default project }
  const [modal, setModal] = useState(null);

  const notify = (text) =>
    setInbox((prev) => [{ id: uid(), text, time: Date.now(), read: false }, ...prev]);

  const projectName = (id) => projects.find((p) => p.id === id)?.name ?? 'Unknown project';

  const saveTask = (data) => {
    if (data.id) {
      setTasks((prev) => prev.map((t) => (t.id === data.id ? data : t)));
      notify(`Task "${data.title}" was updated.`);
    } else {
      const task = { ...data, id: uid() };
      setTasks((prev) => [...prev, task]);
      notify(`New task "${task.title}" added to ${projectName(task.projectId)}.`);
    }
    setModal(null);
  };

  const deleteTask = (id) => {
    const task = tasks.find((t) => t.id === id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (task) notify(`Task "${task.title}" was deleted.`);
    setModal(null);
  };

  const moveTask = (id, status) => {
    const task = tasks.find((t) => t.id === id);
    if (!task || task.status === status) return;
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    notify(`"${task.title}" moved to ${statusLabel(status)}.`);
  };

  const addProject = (project) => {
    const p = { ...project, id: uid() };
    setProjects((prev) => [...prev, p]);
    notify(`Project "${p.name}" was created.`);
    return p;
  };

  const deleteProject = (id) => {
    const p = projects.find((x) => x.id === id);
    setProjects((prev) => prev.filter((x) => x.id !== id));
    setTasks((prev) => prev.filter((t) => t.projectId !== id));
    if (activeProjectId === id) setActiveProjectId(null);
    if (p) notify(`Project "${p.name}" was deleted.`);
  };

  const openProject = (id) => {
    setActiveProjectId(id);
    setView('projects');
  };

  const unreadCount = inbox.filter((n) => !n.read).length;

  const boardProps = {
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
