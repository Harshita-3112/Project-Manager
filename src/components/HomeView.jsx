import { useState } from 'react';
import { STATUSES } from '../data.js';
import Board from './Board.jsx';
import { PlusIcon } from './Icons.jsx';

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
};

export default function HomeView({ tasks, projects, onMove, onOpenTask, onAddTask }) {
  const [filter, setFilter] = useState('all');
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
          <div key={s.id} className="stat" style={{ '--accent': s.color }}>
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
