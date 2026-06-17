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

  const cards: { label: string; value: number; icon: React.ReactNode; bg: string; text: string; shadow: string }[] = [
    {
      label: 'Doing',
      value: active,
      icon: <Circle className="w-5 h-5" />,
      bg: 'bg-[#c9b8ff]',
      text: 'text-[#1a1530]',
      shadow: 'shadow-[4px_4px_0_0_#1a1530]',
    },
    {
      label: 'Done',
      value: completed,
      icon: <CheckCircle2 className="w-5 h-5" />,
      bg: 'bg-[#b8e6c1]',
      text: 'text-[#1a1530]',
      shadow: 'shadow-[4px_4px_0_0_#1a1530]',
    },
    {
      label: 'Today',
      value: today,
      icon: <CalendarDays className="w-5 h-5" />,
      bg: 'bg-[#ffd84d]',
      text: 'text-[#1a1530]',
      shadow: 'shadow-[4px_4px_0_0_#1a1530]',
    },
    {
      label: 'Overdue',
      value: overdue,
      icon: <AlertTriangle className="w-5 h-5" />,
      bg: 'bg-[#ff7a59]',
      text: 'text-white',
      shadow: 'shadow-[4px_4px_0_0_#1a1530]',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {cards.map((c) => (
          <div
            key={c.label}
            className={`rounded-2xl px-3 py-3 flex items-center gap-2 border-2 border-[#1a1530] ${c.bg} ${c.text} ${c.shadow}`}
          >
            {c.icon}
            <div>
              <div className="text-2xl font-black leading-none" style={{ fontFamily: 'Fraunces, serif' }}>{c.value}</div>
              <div className="text-[11px] font-bold uppercase tracking-wider opacity-80">{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      {total > 0 && (
        <div className="bg-white dark:bg-[#1f1a35] border-2 border-[#1a1530] dark:border-[#f1ecff]/20 rounded-2xl p-3">
          <div className="flex items-center justify-between text-xs font-bold text-[#1a1530] dark:text-[#f1ecff] mb-2">
            <span className="uppercase tracking-wider">Momentum</span>
            <span>
              {completed} / {total} ({progress}%)
            </span>
          </div>
          <div className="w-full h-3 bg-[#faf7f2] dark:bg-[#14111f] rounded-full overflow-hidden border-2 border-[#1a1530] dark:border-[#f1ecff]/20">
            <div
              className="h-full bg-gradient-to-r from-[#ffd84d] via-[#ff7a59] to-[#6e56ff] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
