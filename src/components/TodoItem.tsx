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
  high: 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/40 dark:text-rose-300 dark:border-rose-800',
  medium: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-800',
  low: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-800',
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
        'group bg-white/70 dark:bg-slate-800/60 backdrop-blur border rounded-xl shadow-sm hover:shadow-md transition-shadow',
        overdue
          ? 'border-rose-300 dark:border-rose-800'
          : 'border-slate-200 dark:border-slate-700',
      )}
    >
      <div className="flex items-center gap-3 px-3 sm:px-4 py-3">
        <span
          className="cursor-grab text-slate-300 hover:text-slate-500 dark:text-slate-600 dark:hover:text-slate-400"
          aria-label="Drag to reorder"
        >
          <GripVertical className="w-4 h-4" />
        </span>

        <button
          onClick={() => onToggle(todo.id)}
          aria-label={todo.completed ? 'Mark as not done' : 'Mark as done'}
          className={clsx(
            'flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors',
            todo.completed
              ? 'bg-indigo-600 border-indigo-600 text-white'
              : 'border-slate-300 dark:border-slate-600 hover:border-indigo-500 bg-white dark:bg-slate-900',
          )}
        >
          {todo.completed && <Check className="w-4 h-4" />}
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
              className="w-full px-2 py-1 rounded-md border border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-900"
            />
          ) : (
            <div
              onDoubleClick={() => setEditing(true)}
              className={clsx(
                'text-slate-800 dark:text-slate-100 cursor-pointer truncate',
                todo.completed && 'line-through text-slate-400 dark:text-slate-500',
              )}
            >
              {todo.title}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-1.5 mt-1">
            {project && (
              <span
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-medium border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300"
                style={{ color: project.color }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: project.color }}
                />
                {project.name}
              </span>
            )}
            <span
              className={clsx(
                'inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-medium border',
                PRIORITY_COLORS[todo.priority],
              )}
            >
              <Flag className="w-3 h-3" />
              {todo.priority}
            </span>
            {todo.dueDate && (
              <span
                className={clsx(
                  'inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-medium border',
                  overdue
                    ? 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/40 dark:text-rose-300 dark:border-rose-800'
                    : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-700/50 dark:text-slate-300 dark:border-slate-600',
                )}
              >
                <Calendar className="w-3 h-3" />
                {formatDue(todo.dueDate)}
              </span>
            )}
            {todo.subtasks.length > 0 && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300">
                {subDone}/{todo.subtasks.length}
              </span>
            )}
            {todo.tags.map((tag) => (
              <button
                key={tag}
                onClick={() => onTagClick(tag)}
                className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100"
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
              className="p-2 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-700"
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
                className="p-2 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-700"
              >
                <Pencil className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => onRemove(todo.id)}
              aria-label="Delete task"
              className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={() => onRemove(todo.id)}
            aria-label="Delete task"
            className="sm:hidden p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 pt-1 border-t border-slate-200 dark:border-slate-700 space-y-3">
          {todo.notes && (
            <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
              {todo.notes}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <label className="flex items-center gap-1 text-slate-500">
              <Calendar className="w-3.5 h-3.5" />
              <input
                type="date"
                value={toInputDate(todo.dueDate)}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  onUpdate(todo.id, { dueDate: fromInputDate(e.target.value) })
                }
                className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200"
              />
            </label>
            <label className="flex items-center gap-1 text-slate-500">
              <Flag className="w-3.5 h-3.5" />
              <select
                value={todo.priority}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  onUpdate(todo.id, { priority: e.target.value as Priority })
                }
                className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </label>
            <label className="flex items-center gap-1 text-slate-500">
              <span>Project</span>
              <select
                value={todo.projectId}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  onUpdate(todo.id, { projectId: e.target.value })
                }
                className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200"
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
            <div className="text-xs font-medium text-slate-500 mb-2">Subtasks</div>
            <ul className="space-y-1">
              {todo.subtasks.map((s) => (
                <li
                  key={s.id}
                  className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700/50"
                >
                  <button
                    onClick={() => onToggleSubtask(todo.id, s.id)}
                    className={clsx(
                      'w-4 h-4 rounded border flex items-center justify-center',
                      s.completed
                        ? 'bg-indigo-600 border-indigo-600 text-white'
                        : 'border-slate-300 dark:border-slate-600',
                    )}
                  >
                    {s.completed && <Check className="w-3 h-3" />}
                  </button>
                  <span
                    className={clsx(
                      'flex-1 text-sm',
                      s.completed
                        ? 'line-through text-slate-400'
                        : 'text-slate-700 dark:text-slate-200',
                    )}
                  >
                    {s.title}
                  </span>
                  <button
                    onClick={() => onRemoveSubtask(todo.id, s.id)}
                    className="text-slate-400 hover:text-rose-600"
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
                placeholder="Add subtask..."
                className="flex-1 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-700 dark:text-slate-200"
              />
              <button
                type="submit"
                disabled={!newSub.trim()}
                className="p-1.5 rounded bg-indigo-600 text-white disabled:bg-slate-300 disabled:cursor-not-allowed"
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
