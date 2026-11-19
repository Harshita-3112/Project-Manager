'use client';

import { useState } from 'react';
import { PROJECT_COLORS } from '@/data';
import Board from './Board';
import { ArrowLeftIcon, PlusIcon, TrashIcon } from './Icons';
import type { Project, Task } from '@/types';
import type { BoardHandlers } from './App';

interface NewProjectFormProps {
  onCreate: (project: Omit<Project, 'id'>) => void;
  onCancel: () => void;
}

interface ProjectsViewProps extends BoardHandlers {
  tasks: Task[];
  activeProjectId: string | null;
  onSelectProject: (id: string | null) => void;
  onAddProject: (project: Omit<Project, 'id'>) => Project;
  onDeleteProject: (id: string) => void;
}

function NewProjectForm({ onCreate, onCancel }: NewProjectFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(PROJECT_COLORS[0]);

  return (
    <form
      className="project-card new-project-form"
      onSubmit={(e) => {
        e.preventDefault();
        if (name.trim()) onCreate({ name: name.trim(), description: description.trim(), color });
      }}
    >
      <input autoFocus placeholder="Project name" value={name} onChange={(e) => setName(e.target.value)} required />
      <textarea rows={2} placeholder="Short description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} />
      <div className="color-picker">
        {PROJECT_COLORS.map((c) => (
          <button
            type="button"
            key={c}
            className={`swatch ${c === color ? 'selected' : ''}`}
            style={{ background: c }}
            onClick={() => setColor(c)}
            aria-label={`Color ${c}`}
          />
        ))}
      </div>
      <div className="modal-actions">
        <span className="spacer" />
        <button type="button" className="btn" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary">Create</button>
      </div>
    </form>
  );
}

export default function ProjectsView({
  tasks, projects, activeProjectId, onSelectProject, onAddProject, onDeleteProject, onMove, onOpenTask, onAddTask,
}: ProjectsViewProps) {
  const [creating, setCreating] = useState(false);
  const project = projects.find((p) => p.id === activeProjectId);

  // ----- Single project: show its board -----
  if (project) {
    const projectTasks = tasks.filter((t) => t.projectId === project.id);
    return (
      <>
        <button className="back-link" onClick={() => onSelectProject(null)}>
          <ArrowLeftIcon /> All projects
        </button>
        <header className="page-header">
          <div>
            <h1>
              <span className="dot dot-lg" style={{ background: project.color }} /> {project.name}
            </h1>
            {project.description && <p className="subtitle">{project.description}</p>}
          </div>
          <div className="header-actions">
            <button
              className="btn btn-danger-outline"
              onClick={() => {
                if (confirm(`Delete "${project.name}" and all its tasks?`)) onDeleteProject(project.id);
              }}
            >
              <TrashIcon /> Delete
            </button>
            <button className="btn btn-primary" onClick={() => onAddTask('todo', project.id)}>
              <PlusIcon /> New task
            </button>
          </div>
        </header>
        <Board
          tasks={projectTasks}
          projects={projects}
          projectId={project.id}
          onMove={onMove}
          onOpenTask={onOpenTask}
          onAddTask={onAddTask}
        />
      </>
    );
  }

  // ----- Projects grid -----
  return (
    <>
      <header className="page-header">
        <div>
          <h1>Projects</h1>
          <p className="subtitle">{projects.length} project{projects.length === 1 ? '' : 's'}</p>
        </div>
        {!creating && (
          <button className="btn btn-primary" onClick={() => setCreating(true)}>
            <PlusIcon /> New project
          </button>
        )}
      </header>

      <div className="project-grid">
        {creating && (
          <NewProjectForm
            onCancel={() => setCreating(false)}
            onCreate={(data) => {
              const p = onAddProject(data);
              setCreating(false);
              onSelectProject(p.id);
            }}
          />
        )}
        {projects.map((p) => {
          const pt = tasks.filter((t) => t.projectId === p.id);
          const done = pt.filter((t) => t.status === 'completed').length;
          const pct = pt.length ? Math.round((done / pt.length) * 100) : 0;
          return (
            <button key={p.id} className="project-card" onClick={() => onSelectProject(p.id)}>
              <div className="project-card-title">
                <span className="dot" style={{ background: p.color }} />
                <h3>{p.name}</h3>
              </div>
              <p className="card-desc">{p.description || 'No description'}</p>
              <div className="progress">
                <div className="progress-bar" style={{ width: `${pct}%`, background: p.color }} />
              </div>
              <div className="project-meta">
                <span>{done}/{pt.length} tasks done</span>
                <span>{pct}%</span>
              </div>
            </button>
          );
        })}
        {projects.length === 0 && !creating && (
          <p className="hint">No projects yet. Click “New project” to get started.</p>
        )}
      </div>
    </>
  );
}
