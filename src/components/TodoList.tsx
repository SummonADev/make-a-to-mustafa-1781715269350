import type { Todo } from '@/types';
import TodoItem from '@/components/TodoItem';
import { ClipboardList } from 'lucide-react';

type TodoListProps = {
  todos: Todo[];
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, title: string) => void;
};

export default function TodoList({ todos, onToggle, onRemove, onUpdate }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
          <ClipboardList className="w-8 h-8 text-indigo-500" />
        </div>
        <p className="text-slate-600 font-medium">No tasks here</p>
        <p className="text-slate-400 text-sm mt-1">Add a task above to get started.</p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {todos.map((t) => (
        <TodoItem
          key={t.id}
          todo={t}
          onToggle={onToggle}
          onRemove={onRemove}
          onUpdate={onUpdate}
        />
      ))}
    </ul>
  );
}
