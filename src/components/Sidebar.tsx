import { HomeIcon, FolderIcon, InboxIcon } from './Icons';

import type { ComponentType } from 'react';
import type { Project, View } from '@/types';

interface SidebarProps {
  view: View;
  onNavigate: (view: View) => void;
  projects: Project[];
  activeProjectId: string | null;
  onOpenProject: (id: string) => void;
  unreadCount: number;
}

const NAV: { id: View; label: string; Icon: ComponentType }[] = [
  { id: 'home', label: 'Home', Icon: HomeIcon },
  { id: 'projects', label: 'Projects', Icon: FolderIcon },
  { id: 'inbox', label: 'Inbox', Icon: InboxIcon },
];

export default function Sidebar({ view, onNavigate, projects, activeProjectId, onOpenProject, unreadCount }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-logo">T</span>
        <span>TaskFlow</span>
      </div>

      <nav className="nav">
        {NAV.map(({ id, label, Icon }) => (
          <button
            key={id}
            className={`nav-item ${view === id ? 'active' : ''}`}
            onClick={() => onNavigate(id)}
          >
            <Icon />
            <span>{label}</span>
            {id === 'inbox' && unreadCount > 0 && <span className="badge">{unreadCount}</span>}
          </button>
        ))}
      </nav>

      {projects.length > 0 && (
        <div className="sidebar-section">
          <div className="sidebar-heading">Your projects</div>
          {projects.map((p) => (
            <button
              key={p.id}
              className={`project-link ${activeProjectId === p.id ? 'active' : ''}`}
              onClick={() => onOpenProject(p.id)}
            >
              <span className="dot" style={{ background: p.color }} />
              <span className="truncate">{p.name}</span>
            </button>
          ))}
        </div>
      )}
    </aside>
  );
}
