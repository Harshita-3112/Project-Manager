import { useState } from 'react';
import { STATUSES } from '../data.js';
import TaskCard from './TaskCard.jsx';
import { PlusIcon } from './Icons.jsx';

/**
 * Kanban board with the four status columns.
 * Cards can be dragged between columns (native HTML5 drag & drop).
 */
export default function Board({ tasks, projects, projectId, showProject, onMove, onOpenTask, onAddTask }) {
  const [dragOver, setDragOver] = useState(null);

  return (
    <div className="board">
      {STATUSES.map((status) => {
        const columnTasks = tasks.filter((t) => t.status === status.id);
        return (
          <section
            key={status.id}
            className={`column ${dragOver === status.id ? 'drag-over' : ''}`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(status.id);
            }}
            onDragLeave={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) setDragOver(null);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(null);
              const id = e.dataTransfer.getData('text/plain');
              if (id) onMove(id, status.id);
            }}
          >
            <header className="column-header">
              <span className="dot" style={{ background: status.color }} />
              <h3>{status.label}</h3>
              <span className="count">{columnTasks.length}</span>
            </header>

            <div className="column-body">
              {columnTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  project={showProject ? projects.find((p) => p.id === task.projectId) : null}
                  onClick={() => onOpenTask(task)}
                />
              ))}
              {columnTasks.length === 0 && <div className="empty-column">Drop tasks here</div>}
            </div>

            <button
              className="add-task"
              disabled={projects.length === 0}
              title={projects.length === 0 ? 'Create a project first' : undefined}
              onClick={() => onAddTask(status.id, projectId)}
            >
              <PlusIcon /> Add task
            </button>
          </section>
        );
      })}
    </div>
  );
}
