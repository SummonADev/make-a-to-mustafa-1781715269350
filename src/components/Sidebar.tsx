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

const COLORS: string[] = ['#6e56ff', '#ff7a59', '#ffd84d', '#b8e6c1', '#c9b8ff', '#ef4444', '#0ea5e9'];

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
    <aside className="w-full lg:w-64 lg:flex-shrink-0 space-y-6">
      <div className="bg-white dark:bg-[#1f1a35] border-2 border-[#1a1530] dark:border-[#f1ecff]/20 rounded-2xl shadow-[5px_5px_0_0_#ff7a59] dark:shadow-[5px_5px_0_0_#c9b8ff] p-4">
        <div className="text-xs font-black uppercase tracking-widest text-[#1a1530] dark:text-[#f1ecff] mb-3 px-1">
          Projects
        </div>
        <ul className="space-y-1">
          <li>
            <button
              onClick={() => onSelectProject('all')}
              className={clsx(
                'w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl text-sm font-semibold transition-all',
                activeProjectId === 'all'
                  ? 'bg-[#1a1530] text-[#ffd84d] dark:bg-[#ffd84d] dark:text-[#1a1530]'
                  : 'text-[#1a1530] dark:text-[#f1ecff] hover:bg-[#ffd84d]/30 dark:hover:bg-[#ffd84d]/10',
              )}
            >
              <span className="flex items-center gap-2">
                <Inbox className="w-4 h-4" />
                Everything
              </span>
              <span className="text-xs font-bold opacity-75">{counts['all'] ?? 0}</span>
            </button>
          </li>
          {projects.map((p) => (
            <li key={p.id} className="group relative">
              <button
                onClick={() => onSelectProject(p.id)}
                className={clsx(
                  'w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl text-sm font-semibold transition-all',
                  activeProjectId === p.id
                    ? 'bg-[#1a1530] text-[#ffd84d] dark:bg-[#ffd84d] dark:text-[#1a1530]'
                    : 'text-[#1a1530] dark:text-[#f1ecff] hover:bg-[#ffd84d]/30 dark:hover:bg-[#ffd84d]/10',
                )}
              >
                <span className="flex items-center gap-2 min-w-0">
                  <Folder className="w-4 h-4" style={{ color: p.color }} fill={p.color} />
                  <span className="truncate">{p.name}</span>
                </span>
                <span className="text-xs font-bold opacity-75">{counts[p.id] ?? 0}</span>
              </button>
              {p.id !== 'inbox' && (
                <button
                  onClick={() => onRemoveProject(p.id)}
                  className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 text-[#1a1530]/60 hover:text-[#ff7a59] bg-white dark:bg-[#1f1a35] rounded"
                  aria-label="Delete project"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </li>
          ))}
        </ul>

        {adding ? (
          <form onSubmit={submit} className="mt-3 p-3 rounded-xl border-2 border-[#1a1530] dark:border-[#f1ecff]/20 bg-[#faf7f2] dark:bg-[#14111f] space-y-2">
            <input
              autoFocus
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              placeholder="Project name"
              className="w-full px-2.5 py-1.5 text-sm rounded-lg border-2 border-[#1a1530] dark:border-[#f1ecff]/20 bg-white dark:bg-[#1f1a35] text-[#1a1530] dark:text-[#f1ecff] font-medium focus:outline-none focus:ring-2 focus:ring-[#ffd84d]"
            />
            <div className="flex gap-1 flex-wrap">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={clsx(
                    'w-6 h-6 rounded-full border-2 transition-transform',
                    color === c ? 'border-[#1a1530] dark:border-white scale-110' : 'border-transparent',
                  )}
                  style={{ backgroundColor: c }}
                  aria-label={`Color ${c}`}
                />
              ))}
            </div>
            <div className="flex gap-1">
              <button
                type="submit"
                className="flex-1 px-2 py-1.5 rounded-lg bg-[#1a1530] text-[#ffd84d] text-xs font-black uppercase tracking-wider"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setAdding(false)}
                className="px-2 py-1.5 rounded-lg border-2 border-[#1a1530] dark:border-[#f1ecff]/20 text-xs font-bold text-[#1a1530] dark:text-[#f1ecff]"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="mt-3 w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-sm font-semibold text-[#1a1530]/70 dark:text-[#f1ecff]/70 hover:text-[#6e56ff] dark:hover:text-[#c9b8ff] hover:bg-[#c9b8ff]/20 border-2 border-dashed border-[#1a1530]/20 dark:border-[#f1ecff]/20 hover:border-[#6e56ff] transition-all"
          >
            <Plus className="w-4 h-4" />
            New project
          </button>
        )}
      </div>

      {allTags.length > 0 && (
        <div className="bg-white dark:bg-[#1f1a35] border-2 border-[#1a1530] dark:border-[#f1ecff]/20 rounded-2xl shadow-[5px_5px_0_0_#b8e6c1] dark:shadow-[5px_5px_0_0_#6e56ff] p-4">
          <div className="text-xs font-black uppercase tracking-widest text-[#1a1530] dark:text-[#f1ecff] mb-3 px-1">
            Tags
          </div>
          <div className="flex flex-wrap gap-1.5">
            {activeTag && (
              <button
                onClick={() => onSelectTag(null)}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-[#ff7a59] text-white"
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
                  'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold border-2 transition-all',
                  activeTag === tag
                    ? 'bg-[#1a1530] text-[#ffd84d] border-[#1a1530]'
                    : 'bg-[#faf7f2] dark:bg-[#14111f] border-[#1a1530] dark:border-[#f1ecff]/20 text-[#1a1530] dark:text-[#f1ecff] hover:bg-[#ffd84d]/40',
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
