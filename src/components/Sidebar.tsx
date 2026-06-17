import { useState } from 'react';
import clsx from 'clsx';
import { Inbox, Folder, Plus, X, Hash } from 'lucide-react';
import type { Project } from '@/types';

type SidebarProps = {
  projects: Project[];
  activeProjectId: string | 'all';
  onSelectProject: (id: string | 'all') => void;
  onAddProject: (name: string, color: string) => void;
  onRemoveProject: (id: string) => void;
  allTags: string[];
  activeTag: string | null;
  onSelectTag: (tag: string | null) => void;
  counts: Record<string, number>;
};

const COLORS: string[] = ['#6366f1', '#ec4899', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function Sidebar({
  projects,
  activeProjectId,
  onSelectProject,
  onAddProject,
  onRemoveProject,
  allTags,
  activeTag,
  onSelectTag,
  counts,
}: SidebarProps) {
  const [adding, setAdding] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [color, setColor] = useState<string>(COLORS[0]);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAddProject(name, color);
    setName('');
    setAdding(false);
  };

  return (
    <aside className="w-full lg:w-60 lg:flex-shrink-0 space-y-5">
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 px-2">
          Projects
        </div>
        <ul className="space-y-0.5">
          <li>
            <button
              onClick={() => onSelectProject('all')}
              className={clsx(
                'w-full flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg text-sm',
                activeProjectId === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800',
              )}
            >
              <span className="flex items-center gap-2">
                <Inbox className="w-4 h-4" />
                All tasks
              </span>
              <span className="text-xs opacity-75">{counts['all'] ?? 0}</span>
            </button>
          </li>
          {projects.map((p) => (
            <li key={p.id} className="group relative">
              <button
                onClick={() => onSelectProject(p.id)}
                className={clsx(
                  'w-full flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg text-sm',
                  activeProjectId === p.id
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800',
                )}
              >
                <span className="flex items-center gap-2 min-w-0">
                  <Folder className="w-4 h-4" style={{ color: p.color }} />
                  <span className="truncate">{p.name}</span>
                </span>
                <span className="text-xs opacity-75">{counts[p.id] ?? 0}</span>
              </button>
              {p.id !== 'inbox' && (
                <button
                  onClick={() => onRemoveProject(p.id)}
                  className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 bg-white dark:bg-slate-900 rounded"
                  aria-label="Delete project"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </li>
          ))}
        </ul>

        {adding ? (
          <form onSubmit={submit} className="mt-2 p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/60 space-y-2">
            <input
              autoFocus
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              placeholder="Project name"
              className="w-full px-2 py-1 text-sm rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
            />
            <div className="flex gap-1">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={clsx(
                    'w-5 h-5 rounded-full border-2',
                    color === c ? 'border-slate-800 dark:border-white' : 'border-transparent',
                  )}
                  style={{ backgroundColor: c }}
                  aria-label={`Color ${c}`}
                />
              ))}
            </div>
            <div className="flex gap-1">
              <button
                type="submit"
                className="flex-1 px-2 py-1 rounded bg-indigo-600 text-white text-xs font-medium"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setAdding(false)}
                className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="mt-2 w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800"
          >
            <Plus className="w-4 h-4" />
            New project
          </button>
        )}
      </div>

      {allTags.length > 0 && (
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 px-2">
            Tags
          </div>
          <div className="flex flex-wrap gap-1 px-2">
            {activeTag && (
              <button
                onClick={() => onSelectTag(null)}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300"
              >
                <X className="w-3 h-3" />
                Clear
              </button>
            )}
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => onSelectTag(activeTag === tag ? null : tag)}
                className={clsx(
                  'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border transition-colors',
                  activeTag === tag
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-700',
                )}
              >
                <Hash className="w-3 h-3" />
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
