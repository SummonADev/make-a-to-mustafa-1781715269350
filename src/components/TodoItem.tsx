import { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import {
  Check,
  Trash2,
  Pencil,
  Calendar,
  Flag,
  ChevronDown,
  ChevronRight,
  Plus,
  X,
  GripVertical,
} from 'lucide-react';
import type { Todo, Priority, Project } from '@/types';
import { formatDue, isOverdue, fromInputDate, toInputDate } from '@/lib/date';

type TodoItemProps = {
  todo: Todo;
  projects: Project[];
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onUpdateTitle: (id: string, title: string) => void;
  onUpdate: (id: string, patch: Partial<Todo>) => void;
  onAddSubtask: (todoId: string, title: string) => void;
  onToggleSubtask: (todoId: string, subId: string) => void;
  onRemoveSubtask: (todoId: string, subId: string) => void;
  onTagClick: (tag: string) => void;
  onDragStart: (id: string) => void;
  onDropOn: (id: string) => void;
};

const PRIORITY_COLORS: Record<Priority, string> = {
  high: 'bg-[#ff7a59] text-white border-[#1a1530]',
  medium: 'bg-[#ffd84d] text-[#1a1530] border-[#1a1530]',
  low: 'bg-[#b8e6c1] text-[#1a1530] border-[#1a1530]',
};

export default function TodoItem({
  todo,
  projects,
  onToggle,
  onRemove,
  onUpdateTitle,
  onUpdate,
  onAddSubtask,
  onToggleSubtask,
  onRemoveSubtask,
  onTagClick,
  onDragStart,
  onDropOn,
}: TodoItemProps) {
  const [editing, setEditing] = useState<boolean>(false);
  const [draft, setDraft] = useState<string>(todo.title);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [newSub, setNewSub] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  const commit = () => {
    onUpdateTitle(todo.id, draft);
    setEditing(false);
  };
  const cancel = () => {
    setDraft(todo.title);
    setEditing(false);
  };

  const overdue = isOverdue(todo.dueDate, todo.completed);
  const project = projects.find((p) => p.id === todo.projectId);
  const subDone = todo.subtasks.filter((s) => s.completed).length;
  const hasDetails = todo.subtasks.length > 0 || !!todo.notes;

  return (
    <li
      draggable
      onDragStart={() => onDragStart(todo.id)}
      onDragOver={(e: React.DragEvent<HTMLLIElement>) => e.preventDefault()}
      onDrop={() => onDropOn(todo.id)}
      className={clsx(
        'group bg-white dark:bg-[#1f1a35] border-2 rounded-2xl transition-all',
        overdue
          ? 'border-[#ff7a59] shadow-[3px_3px_0_0_#ff7a59]'
          : 'border-[#1a1530] dark:border-[#f1ecff]/20 shadow-[3px_3px_0_0_#1a1530] dark:shadow-[3px_3px_0_0_#ffd84d]',
        todo.completed && 'opacity-70',
      )}
    >
      <div className="flex items-center gap-3 px-3 sm:px-4 py-3">
        <span
          className="cursor-grab text-[#1a1530]/30 hover:text-[#1a1530] dark:text-[#f1ecff]/30 dark:hover:text-[#f1ecff]"
          aria-label="Drag to reorder"
        >
          <GripVertical className="w-4 h-4" />
        </span>

        <button
          onClick={() => onToggle(todo.id)}
          aria-label={todo.completed ? 'Mark as not done' : 'Mark as done'}
          className={clsx(
            'flex-shrink-0 w-7 h-7 rounded-full border-2 border-[#1a1530] dark:border-[#f1ecff] flex items-center justify-center transition-all',
            todo.completed
              ? 'bg-[#b8e6c1] text-[#1a1530]'
              : 'bg-white dark:bg-[#1f1a35] hover:bg-[#ffd84d]',
          )}
        >
          {todo.completed && <Check className="w-4 h-4" strokeWidth={3} />}
        </button>

        <div className="flex-1 min-w-0">
          {editing ? (
            <input
              ref={inputRef}
              value={draft}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDraft(e.target.value)}
              onBlur={commit}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === 'Enter') commit();
                if (e.key === 'Escape') cancel();
              }}
              className="w-full px-2 py-1 rounded-md border-2 border-[#ffd84d] focus:outline-none focus:ring-2 focus:ring-[#ffd84d] text-[#1a1530] dark:text-[#f1ecff] bg-white dark:bg-[#14111f] font-semibold"
            />
          ) : (
            <div
              onDoubleClick={() => setEditing(true)}
              className={clsx(
                'text-[#1a1530] dark:text-[#f1ecff] cursor-pointer truncate font-semibold',
                todo.completed && 'line-through text-[#1a1530]/40 dark:text-[#f1ecff]/40',
              )}
            >
              {todo.title}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
            {project && (
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold border-2 border-[#1a1530] dark:border-[#f1ecff]/30 bg-white dark:bg-[#14111f] text-[#1a1530] dark:text-[#f1ecff]"
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: project.color }}
                />
                {project.name}
              </span>
            )}
            <span
              className={clsx(
                'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold border-2',
                PRIORITY_COLORS[todo.priority],
              )}
            >
              <Flag className="w-3 h-3" />
              {todo.priority}
            </span>
            {todo.dueDate && (
              <span
                className={clsx(
                  'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold border-2',
                  overdue
                    ? 'bg-[#ff7a59] text-white border-[#1a1530]'
                    : 'bg-[#faf7f2] dark:bg-[#14111f] text-[#1a1530] dark:text-[#f1ecff] border-[#1a1530] dark:border-[#f1ecff]/30',
                )}
              >
                <Calendar className="w-3 h-3" />
                {formatDue(todo.dueDate)}
              </span>
            )}
            {todo.subtasks.length > 0 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold border-2 border-[#1a1530] dark:border-[#f1ecff]/30 bg-[#c9b8ff] text-[#1a1530]">
                {subDone}/{todo.subtasks.length}
              </span>
            )}
            {todo.tags.map((tag) => (
              <button
                key={tag}
                onClick={() => onTagClick(tag)}
                className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold border-2 border-[#1a1530] dark:border-[#f1ecff]/30 bg-[#c9b8ff]/40 text-[#1a1530] dark:text-[#f1ecff] hover:bg-[#c9b8ff]"
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1">
          {hasDetails && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="p-2 rounded-lg text-[#1a1530]/60 dark:text-[#f1ecff]/60 hover:text-[#6e56ff] dark:hover:text-[#c9b8ff] hover:bg-[#c9b8ff]/30"
              aria-label="Toggle details"
            >
              {expanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          )}
          <div className="hidden sm:flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                aria-label="Edit task"
                className="p-2 rounded-lg text-[#1a1530]/60 dark:text-[#f1ecff]/60 hover:text-[#6e56ff] dark:hover:text-[#c9b8ff] hover:bg-[#c9b8ff]/30"
              >
                <Pencil className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => onRemove(todo.id)}
              aria-label="Delete task"
              className="p-2 rounded-lg text-[#1a1530]/60 dark:text-[#f1ecff]/60 hover:text-white hover:bg-[#ff7a59]"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={() => onRemove(todo.id)}
            aria-label="Delete task"
            className="sm:hidden p-2 rounded-lg text-[#1a1530]/60 dark:text-[#f1ecff]/60 hover:text-white hover:bg-[#ff7a59]"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 pt-1 border-t-2 border-dashed border-[#1a1530]/20 dark:border-[#f1ecff]/20 space-y-3">
          {todo.notes && (
            <p className="text-sm font-medium text-[#1a1530]/80 dark:text-[#f1ecff]/80 whitespace-pre-wrap bg-[#ffd84d]/20 p-3 rounded-xl border-2 border-dashed border-[#ffd84d]">
              {todo.notes}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <label className="flex items-center gap-1 font-bold text-[#1a1530]/70 dark:text-[#f1ecff]/70">
              <Calendar className="w-3.5 h-3.5" />
              <input
                type="date"
                value={toInputDate(todo.dueDate)}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  onUpdate(todo.id, { dueDate: fromInputDate(e.target.value) })
                }
                className="px-2 py-1 rounded-lg border-2 border-[#1a1530] dark:border-[#f1ecff]/20 bg-white dark:bg-[#14111f] text-[#1a1530] dark:text-[#f1ecff] font-medium"
              />
            </label>
            <label className="flex items-center gap-1 font-bold text-[#1a1530]/70 dark:text-[#f1ecff]/70">
              <Flag className="w-3.5 h-3.5" />
              <select
                value={todo.priority}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  onUpdate(todo.id, { priority: e.target.value as Priority })
                }
                className="px-2 py-1 rounded-lg border-2 border-[#1a1530] dark:border-[#f1ecff]/20 bg-white dark:bg-[#14111f] text-[#1a1530] dark:text-[#f1ecff] font-medium"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </label>
            <label className="flex items-center gap-1 font-bold text-[#1a1530]/70 dark:text-[#f1ecff]/70">
              <span>Project</span>
              <select
                value={todo.projectId}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  onUpdate(todo.id, { projectId: e.target.value })
                }
                className="px-2 py-1 rounded-lg border-2 border-[#1a1530] dark:border-[#f1ecff]/20 bg-white dark:bg-[#14111f] text-[#1a1530] dark:text-[#f1ecff] font-medium"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div>
            <div className="text-xs font-black uppercase tracking-wider text-[#1a1530] dark:text-[#f1ecff] mb-2">Subtasks</div>
            <ul className="space-y-1">
              {todo.subtasks.map((s) => (
                <li
                  key={s.id}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[#ffd84d]/20"
                >
                  <button
                    onClick={() => onToggleSubtask(todo.id, s.id)}
                    className={clsx(
                      'w-5 h-5 rounded-md border-2 border-[#1a1530] dark:border-[#f1ecff] flex items-center justify-center',
                      s.completed
                        ? 'bg-[#b8e6c1] text-[#1a1530]'
                        : 'bg-white dark:bg-[#14111f]',
                    )}
                  >
                    {s.completed && <Check className="w-3 h-3" strokeWidth={3} />}
                  </button>
                  <span
                    className={clsx(
                      'flex-1 text-sm font-medium',
                      s.completed
                        ? 'line-through text-[#1a1530]/40 dark:text-[#f1ecff]/40'
                        : 'text-[#1a1530] dark:text-[#f1ecff]',
                    )}
                  >
                    {s.title}
                  </span>
                  <button
                    onClick={() => onRemoveSubtask(todo.id, s.id)}
                    className="text-[#1a1530]/40 hover:text-[#ff7a59]"
                    aria-label="Remove subtask"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))}
            </ul>
            <form
              onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                if (!newSub.trim()) return;
                onAddSubtask(todo.id, newSub);
                setNewSub('');
              }}
              className="flex items-center gap-2 mt-2"
            >
              <input
                value={newSub}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewSub(e.target.value)}
                placeholder="Break it into a smaller step..."
                className="flex-1 px-2 py-1.5 rounded-lg border-2 border-[#1a1530] dark:border-[#f1ecff]/20 bg-white dark:bg-[#14111f] text-sm font-medium text-[#1a1530] dark:text-[#f1ecff] placeholder-[#1a1530]/40 dark:placeholder-[#f1ecff]/40"
              />
              <button
                type="submit"
                disabled={!newSub.trim()}
                className="p-1.5 rounded-lg bg-[#1a1530] text-[#ffd84d] disabled:bg-[#1a1530]/30 disabled:cursor-not-allowed border-2 border-[#1a1530]"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </li>
  );
}
