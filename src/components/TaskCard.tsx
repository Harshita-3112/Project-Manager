import { CalendarIcon } from './Icons';

import type { Project, Task } from '@/types';

interface TaskCardProps {
  task: Task;
  project?: Project;
  onClick: () => void;
}

const formatDate = (iso: string) =>
  new Date(iso + 'T00:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

const isOverdue = (task: Task) =>
  task.dueDate && task.status !== 'completed' && task.dueDate < new Date().toISOString().slice(0, 10);

export default function TaskCard({ task, project, onClick }: TaskCardProps) {
  return (
    <article
      className="card"
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', task.id);
        e.dataTransfer.effectAllowed = 'move';
        e.currentTarget.classList.add('dragging');
      }}
      onDragEnd={(e) => e.currentTarget.classList.remove('dragging')}
      onClick={onClick}
    >
      {project && (
        <div className="card-project">
          <span className="dot" style={{ background: project.color }} />
          {project.name}
        </div>
      )}
      <h4 className={task.status === 'completed' ? 'done' : ''}>{task.title}</h4>
      {task.description && <p className="card-desc">{task.description}</p>}
      <footer className="card-footer">
        <span className={`priority priority-${task.priority.toLowerCase()}`}>{task.priority}</span>
        {task.dueDate && (
          <span className={`due ${isOverdue(task) ? 'overdue' : ''}`}>
            <CalendarIcon /> {formatDate(task.dueDate)}
          </span>
        )}
      </footer>
    </article>
  );
}
