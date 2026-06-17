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
  { key: 'active', label: 'Doing' },
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
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1a1530]/50 dark:text-[#f1ecff]/50" />
        <input
          type="text"
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
          placeholder="Search tasks, tags, notes..."
          className="w-full pl-9 pr-3 py-2.5 rounded-xl border-2 border-[#1a1530] dark:border-[#f1ecff]/20 bg-[#faf7f2] dark:bg-[#14111f] text-sm font-medium text-[#1a1530] dark:text-[#f1ecff] placeholder-[#1a1530]/40 dark:placeholder-[#f1ecff]/40 focus:outline-none focus:ring-2 focus:ring-[#ffd84d]"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-sm font-bold text-[#1a1530] dark:text-[#f1ecff]">
          {activeCount} {activeCount === 1 ? 'thing' : 'things'} to do
        </span>

        <div className="flex items-center gap-1 bg-[#faf7f2] dark:bg-[#14111f] border-2 border-[#1a1530] dark:border-[#f1ecff]/20 rounded-xl p-1">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => onFilterChange(f.key)}
              className={clsx(
                'px-3 py-1 text-sm rounded-lg font-bold transition-all',
                filter === f.key
                  ? 'bg-[#1a1530] text-[#ffd84d] dark:bg-[#ffd84d] dark:text-[#1a1530]'
                  : 'text-[#1a1530] dark:text-[#f1ecff] hover:bg-[#ffd84d]/30',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-1 text-sm font-bold text-[#1a1530] dark:text-[#f1ecff]">
          <ArrowUpDown className="w-4 h-4" />
          <select
            value={sort}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              onSortChange(e.target.value as SortMode)
            }
            className="px-2 py-1 rounded-lg border-2 border-[#1a1530] dark:border-[#f1ecff]/20 bg-[#faf7f2] dark:bg-[#14111f] text-sm font-bold text-[#1a1530] dark:text-[#f1ecff]"
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
          className="text-sm font-bold text-[#1a1530]/70 dark:text-[#f1ecff]/70 hover:text-[#ff7a59] disabled:text-[#1a1530]/30 dark:disabled:text-[#f1ecff]/30 disabled:cursor-not-allowed transition-colors uppercase tracking-wider"
        >
          Clear done
        </button>
      </div>
    </div>
  );
}
