import { useState } from 'react';
import { Plus, Calendar, Flag, Tag as TagIcon, ChevronDown, ChevronUp } from 'lucide-react';
import clsx from 'clsx';
import type { Priority, Project } from '@/types';
import { fromInputDate, toInputDate } from '@/lib/date';
import type { NewTodoInput } from '@/hooks/useTodos';

type TodoInputProps = {
  onAdd: (input: NewTodoInput) => void;
  projects: Project[];
  defaultProjectId: string;
};

const PRIORITIES: { value: Priority; label: string; color: string }[] = [
  { value: 'low', label: 'Low', color: 'text-emerald-600' },
  { value: 'medium', label: 'Medium', color: 'text-amber-600' },
  { value: 'high', label: 'High', color: 'text-rose-600' },
];

export default function TodoInput({ onAdd, projects, defaultProjectId }: TodoInputProps) {
  const [title, setTitle] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [dueDate, setDueDate] = useState<number | null>(null);
  const [priority, setPriority] = useState<Priority>('medium');
  const [tagsRaw, setTagsRaw] = useState<string>('');
  const [projectId, setProjectId] = useState<string>(
    defaultProjectId === 'all' ? 'inbox' : defaultProjectId,
  );
  const [expanded, setExpanded] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({
      title,
      notes,
      dueDate,
      priority,
      tags: tagsRaw.split(',').map((s) => s.trim()).filter(Boolean),
      projectId,
    });
    setTitle('');
    setNotes('');
    setDueDate(null);
    setPriority('medium');
    setTagsRaw('');
    setExpanded(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-2 items-center">
        <input
          type="text"
          value={title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/60 backdrop-blur focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-slate-800 dark:text-slate-100 placeholder-slate-400 shadow-sm"
        />
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="p-3 rounded-xl bg-white/70 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-white shadow-sm"
          aria-label="Toggle details"
        >
          {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
        <button
          type="submit"
          disabled={!title.trim()}
          className="px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium flex items-center gap-1 shadow-sm transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">Add</span>
        </button>
      </div>

      {expanded && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-white/50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
          <label className="flex flex-col gap-1 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Due date
            </span>
            <input
              type="date"
              value={toInputDate(dueDate)}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setDueDate(fromInputDate(e.target.value))
              }
              className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm"
            />
          </label>

          <label className="flex flex-col gap-1 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <Flag className="w-3.5 h-3.5" /> Priority
            </span>
            <div className="flex gap-1">
              {PRIORITIES.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setPriority(p.value)}
                  className={clsx(
                    'flex-1 px-2 py-2 rounded-lg text-sm font-medium border transition-colors',
                    priority === p.value
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 ' + p.color,
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </label>

          <label className="flex flex-col gap-1 text-xs text-slate-500 dark:text-slate-400">
            <span>Project</span>
            <select
              value={projectId}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setProjectId(e.target.value)}
              className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <TagIcon className="w-3.5 h-3.5" /> Tags (comma separated)
            </span>
            <input
              type="text"
              value={tagsRaw}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTagsRaw(e.target.value)}
              placeholder="home, urgent"
              className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm"
            />
          </label>

          <label className="sm:col-span-2 flex flex-col gap-1 text-xs text-slate-500 dark:text-slate-400">
            <span>Notes</span>
            <textarea
              value={notes}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value)}
              placeholder="Optional details..."
              rows={2}
              className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm resize-none"
            />
          </label>
        </div>
      )}
    </form>
  );
}
