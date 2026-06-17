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

const PRIORITIES: { value: Priority; label: string; bg: string }[] = [
  { value: 'low', label: 'Low', bg: 'bg-[#b8e6c1]' },
  { value: 'medium', label: 'Medium', bg: 'bg-[#ffd84d]' },
  { value: 'high', label: 'High', bg: 'bg-[#ff7a59]' },
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
          placeholder="What's one small step you can take?"
          className="flex-1 px-4 py-3 rounded-xl border-2 border-[#1a1530] dark:border-[#f1ecff]/20 bg-[#faf7f2] dark:bg-[#14111f] focus:outline-none focus:ring-2 focus:ring-[#ffd84d] text-[#1a1530] dark:text-[#f1ecff] placeholder-[#1a1530]/40 dark:placeholder-[#f1ecff]/40 font-medium"
        />
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="p-3 rounded-xl bg-[#faf7f2] dark:bg-[#14111f] border-2 border-[#1a1530] dark:border-[#f1ecff]/20 text-[#1a1530] dark:text-[#f1ecff] hover:bg-[#ffd84d]/30 transition-colors"
          aria-label="Toggle details"
        >
          {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
        <button
          type="submit"
          disabled={!title.trim()}
          className="px-4 py-3 rounded-xl bg-[#1a1530] hover:bg-[#1a1530]/90 disabled:bg-[#1a1530]/30 disabled:cursor-not-allowed text-[#ffd84d] font-black uppercase tracking-wider flex items-center gap-1 border-2 border-[#1a1530] shadow-[3px_3px_0_0_#ff7a59] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_0_#ff7a59] transition-all"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">Go</span>
        </button>
      </div>

      {expanded && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-[#faf7f2] dark:bg-[#14111f] border-2 border-[#1a1530] dark:border-[#f1ecff]/20">
          <label className="flex flex-col gap-1.5 text-xs font-bold uppercase tracking-wider text-[#1a1530]/70 dark:text-[#f1ecff]/70">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Due date
            </span>
            <input
              type="date"
              value={toInputDate(dueDate)}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setDueDate(fromInputDate(e.target.value))
              }
              className="px-3 py-2 rounded-lg border-2 border-[#1a1530] dark:border-[#f1ecff]/20 bg-white dark:bg-[#1f1a35] text-[#1a1530] dark:text-[#f1ecff] text-sm font-medium"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-xs font-bold uppercase tracking-wider text-[#1a1530]/70 dark:text-[#f1ecff]/70">
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
                    'flex-1 px-2 py-2 rounded-lg text-sm font-bold border-2 border-[#1a1530] dark:border-[#f1ecff]/20 transition-transform',
                    priority === p.value
                      ? `${p.bg} text-[#1a1530] scale-[1.02]`
                      : 'bg-white dark:bg-[#1f1a35] text-[#1a1530] dark:text-[#f1ecff] hover:scale-[1.01]',
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </label>

          <label className="flex flex-col gap-1.5 text-xs font-bold uppercase tracking-wider text-[#1a1530]/70 dark:text-[#f1ecff]/70">
            <span>Project</span>
            <select
              value={projectId}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setProjectId(e.target.value)}
              className="px-3 py-2 rounded-lg border-2 border-[#1a1530] dark:border-[#f1ecff]/20 bg-white dark:bg-[#1f1a35] text-[#1a1530] dark:text-[#f1ecff] text-sm font-medium"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5 text-xs font-bold uppercase tracking-wider text-[#1a1530]/70 dark:text-[#f1ecff]/70">
            <span className="flex items-center gap-1">
              <TagIcon className="w-3.5 h-3.5" /> Tags (comma separated)
            </span>
            <input
              type="text"
              value={tagsRaw}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTagsRaw(e.target.value)}
              placeholder="deep-work, quick-win"
              className="px-3 py-2 rounded-lg border-2 border-[#1a1530] dark:border-[#f1ecff]/20 bg-white dark:bg-[#1f1a35] text-[#1a1530] dark:text-[#f1ecff] text-sm font-medium"
            />
          </label>

          <label className="sm:col-span-2 flex flex-col gap-1.5 text-xs font-bold uppercase tracking-wider text-[#1a1530]/70 dark:text-[#f1ecff]/70">
            <span>Notes</span>
            <textarea
              value={notes}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value)}
              placeholder="Why does this matter? Break it down..."
              rows={2}
              className="px-3 py-2 rounded-lg border-2 border-[#1a1530] dark:border-[#f1ecff]/20 bg-white dark:bg-[#1f1a35] text-[#1a1530] dark:text-[#f1ecff] text-sm font-medium resize-none"
            />
          </label>
        </div>
      )}
    </form>
  );
}
