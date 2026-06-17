import { CheckCircle2, Circle, AlertTriangle, CalendarDays } from 'lucide-react';

type StatsBarProps = {
  total: number;
  completed: number;
  active: number;
  overdue: number;
  today: number;
};

export default function StatsBar({ total, completed, active, overdue, today }: StatsBarProps) {
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  const cards: { label: string; value: number; icon: React.ReactNode; color: string }[] = [
    {
      label: 'Active',
      value: active,
      icon: <Circle className="w-4 h-4" />,
      color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 dark:text-indigo-300',
    },
    {
      label: 'Done',
      value: completed,
      icon: <CheckCircle2 className="w-4 h-4" />,
      color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-300',
    },
    {
      label: 'Today',
      value: today,
      icon: <CalendarDays className="w-4 h-4" />,
      color: 'text-sky-600 bg-sky-50 dark:bg-sky-900/30 dark:text-sky-300',
    },
    {
      label: 'Overdue',
      value: overdue,
      icon: <AlertTriangle className="w-4 h-4" />,
      color: 'text-rose-600 bg-rose-50 dark:bg-rose-900/30 dark:text-rose-300',
    },
  ];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {cards.map((c) => (
          <div
            key={c.label}
            className={`rounded-xl px-3 py-2 flex items-center gap-2 ${c.color}`}
          >
            {c.icon}
            <div>
              <div className="text-lg font-bold leading-none">{c.value}</div>
              <div className="text-[11px] opacity-80">{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      {total > 0 && (
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Progress</span>
            <span>
              {completed} / {total} ({progress}%)
            </span>
          </div>
          <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
