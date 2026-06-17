import clsx from 'clsx';
import type { FilterMode } from '@/types';

type FilterBarProps = {
  filter: FilterMode;
  onChange: (f: FilterMode) => void;
  activeCount: number;
  completedCount: number;
  onClearCompleted: () => void;
};

const FILTERS: { key: FilterMode; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Completed' },
];

export default function FilterBar({
  filter,
  onChange,
  activeCount,
  completedCount,
  onClearCompleted,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-1">
      <span className="text-sm text-slate-500">
        {activeCount} {activeCount === 1 ? 'task' : 'tasks'} remaining
      </span>

      <div className="flex items-center gap-1 bg-white/70 backdrop-blur border border-slate-200 rounded-lg p-1 shadow-sm">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => onChange(f.key)}
            className={clsx(
              'px-3 py-1 text-sm rounded-md font-medium transition-colors',
              filter === f.key
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50'
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <button
        onClick={onClearCompleted}
        disabled={completedCount === 0}
        className="text-sm text-slate-500 hover:text-rose-600 disabled:text-slate-300 disabled:cursor-not-allowed transition-colors"
      >
        Clear completed
      </button>
    </div>
  );
}
