import { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import { Check, Trash2, Pencil } from 'lucide-react';
import type { Todo } from '@/types';

type TodoItemProps = {
  todo: Todo;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, title: string) => void;
};

export default function TodoItem({ todo, onToggle, onRemove, onUpdate }: TodoItemProps) {
  const [editing, setEditing] = useState<boolean>(false);
  const [draft, setDraft] = useState<string>(todo.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  const commit = () => {
    onUpdate(todo.id, draft);
    setEditing(false);
  };

  const cancel = () => {
    setDraft(todo.title);
    setEditing(false);
  };

  return (
    <li className="group flex items-center gap-3 px-4 py-3 bg-white/70 backdrop-blur border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <button
        onClick={() => onToggle(todo.id)}
        aria-label={todo.completed ? 'Mark as not done' : 'Mark as done'}
        className={clsx(
          'flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors',
          todo.completed
            ? 'bg-indigo-600 border-indigo-600 text-white'
            : 'border-slate-300 hover:border-indigo-500 bg-white'
        )}
      >
        {todo.completed && <Check className="w-4 h-4" />}
      </button>

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
          className="flex-1 px-2 py-1 rounded-md border border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-slate-800"
        />
      ) : (
        <span
          onDoubleClick={() => setEditing(true)}
          className={clsx(
            'flex-1 text-slate-800 truncate cursor-pointer',
            todo.completed && 'line-through text-slate-400'
          )}
        >
          {todo.title}
        </span>
      )}

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            aria-label="Edit task"
            className="p-2 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"
          >
            <Pencil className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={() => onRemove(todo.id)}
          aria-label="Delete task"
          className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </li>
  );
}
