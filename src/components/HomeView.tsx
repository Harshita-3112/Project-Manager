'use client';

import { useState, type CSSProperties } from 'react';
import { STATUSES } from '@/data';
import Board from './Board';
import { PlusIcon } from './Icons';
import type { Task } from '@/types';
import type { BoardHandlers } from './App';

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
};

interface HomeViewProps extends BoardHandlers {
  tasks: Task[];
}

export default function HomeView({ tasks, projects, onMove, onOpenTask, onAddTask }: HomeViewProps) {
  const [filter, setFilter] = useState<string>('all');
  const visible = filter === 'all' ? tasks : tasks.filter((t) => t.projectId === filter);

  return (
    <>
      <header className="page-header">
        <div>
          <h1>{greeting()} 👋</h1>
          <p className="subtitle">Here's an overview of all your tasks.</p>
        </div>
        <div className="header-actions">
          <select className="filter" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <button
            className="btn btn-primary"
            disabled={projects.length === 0}
            onClick={() => onAddTask('todo', filter === 'all' ? undefined : filter)}
          >
            <PlusIcon /> New task
          </button>
        </div>
      </header>

      <div className="stats">
        {STATUSES.map((s) => (
          <div key={s.id} className="stat" style={{ '--accent': s.color } as CSSProperties}>
            <span className="stat-label">{s.label}</span>
            <span className="stat-value">{visible.filter((t) => t.status === s.id).length}</span>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <p className="hint">You don't have any projects yet — create one from the Projects tab to start adding tasks.</p>
      )}

      <Board
        tasks={visible}
        projects={projects}
        projectId={filter === 'all' ? undefined : filter}
        showProject={filter === 'all'}
        onMove={onMove}
        onOpenTask={onOpenTask}
        onAddTask={onAddTask}
      />
    </>
  );
}
