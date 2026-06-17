import clsx from 'clsx';
import { Search, ArrowUpDown } from 'lucide-react';
import type { FilterMode, SortMode } from '@/types';

type FilterBarProps = {
  filter: FilterMode;
  onFilterChange: (f: FilterMode) => void;
  sort: SortMode;
  onSortChange: (s: SortMode) => void;
  search: string;
  onSearchChange: (q: string) => void;
  activeCount: number;
  completedCount: number;
  onClearCompleted: () => void;
};

const FILTERS: { key: FilterMode; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Done' },
];

const SORTS: { key: SortMode; label: string }[] = [
  { key: 'created', label: 'Newest' },
  { key: 'due', label: 'Due date' },
  { key: 'priority', label: 'Priority' },
  { key: 'alpha', label: 'Alphabetical' },
  { key: 'manual', label: 'Manual' },
];

export default function FilterBar({
  filter,
  onFilterChange,
  sort,
  onSortChange,
  search,
  onSearchChange,
  activeCount,
  completedCount,
  onClearCompleted,
}: FilterBarProps) {
  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
          placeholder="Search tasks, tags, notes..."
          className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/60 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-sm text-slate-500 dark:text-slate-400">
          {activeCount} {activeCount === 1 ? 'task' : 'tasks'} remaining
        </span>

        <div className="flex items-center gap-1 bg-white/70 dark:bg-slate-800/60 backdrop-blur border border-slate-200 dark:border-slate-700 rounded-lg p-1 shadow-sm">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => onFilterChange(f.key)}
              className={clsx(
                'px-3 py-1 text-sm rounded-md font-medium transition-colors',
                filter === f.key
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-700',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
          <ArrowUpDown className="w-4 h-4" />
          <select
            value={sort}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              onSortChange(e.target.value as SortMode)
            }
            className="px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/60 text-sm text-slate-700 dark:text-slate-200"
          >
            {SORTS.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        </label>

        <button
          onClick={onClearCompleted}
          disabled={completedCount === 0}
          className="text-sm text-slate-500 hover:text-rose-600 disabled:text-slate-300 disabled:cursor-not-allowed transition-colors"
        >
          Clear completed
        </button>
      </div>
    </div>
  );
}
