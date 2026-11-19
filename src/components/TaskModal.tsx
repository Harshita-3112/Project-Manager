'use client';

import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { PRIORITIES, STATUSES } from '@/data';
import type { Project, StatusId, Task, TaskDraft } from '@/types';

interface TaskModalProps {
  task?: Task;
  defaultStatus?: StatusId;
  defaultProjectId?: string;
  projects: Project[];
  onSave: (task: TaskDraft) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export default function TaskModal({ task, defaultStatus, defaultProjectId, projects, onSave, onDelete, onClose }: TaskModalProps) {
  const [form, setForm] = useState<TaskDraft>(
    task ?? {
      title: '',
      description: '',
      status: defaultStatus ?? 'todo',
      priority: 'Medium',
      dueDate: '',
      projectId: defaultProjectId ?? '',
    }
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const set =
    (field: keyof TaskDraft) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm({ ...form, [field]: e.target.value });

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSave({ ...form, title: form.title.trim() });
  };

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form className="modal" onSubmit={submit}>
        <h2>{task ? 'Edit task' : 'New task'}</h2>

        <label>
          Title
          <input autoFocus value={form.title} onChange={set('title')} placeholder="What needs to be done?" required />
        </label>

        <label>
          Description
          <textarea rows={3} value={form.description} onChange={set('description')} placeholder="Add more details…" />
        </label>

        <div className="form-row">
          <label>
            Project
            <select value={form.projectId} onChange={set('projectId')}>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </label>
          <label>
            Status
            <select value={form.status} onChange={set('status')}>
              {STATUSES.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="form-row">
          <label>
            Priority
            <select value={form.priority} onChange={set('priority')}>
              {PRIORITIES.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </label>
          <label>
            Due date
            <input type="date" value={form.dueDate} onChange={set('dueDate')} />
          </label>
        </div>

        <div className="modal-actions">
          {task && (
            <button type="button" className="btn btn-danger" onClick={() => onDelete(task.id)}>
              Delete
            </button>
          )}
          <span className="spacer" />
          <button type="button" className="btn" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary">{task ? 'Save changes' : 'Create task'}</button>
        </div>
      </form>
    </div>
  );
}
