import { useRef } from 'react';
import type { Todo, Project } from '@/types';
import TodoItem from '@/components/TodoItem';
import { ClipboardList } from 'lucide-react';

type TodoListProps = {
  todos: Todo[];
  projects: Project[];
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onUpdateTitle: (id: string, title: string) => void;
  onUpdate: (id: string, patch: Partial<Todo>) => void;
  onAddSubtask: (todoId: string, title: string) => void;
  onToggleSubtask: (todoId: string, subId: string) => void;
  onRemoveSubtask: (todoId: string, subId: string) => void;
  onTagClick: (tag: string) => void;
  onReorder: (sourceId: string, targetId: string) => void;
};

export default function TodoList(props: TodoListProps) {
  const { todos } = props;
  const dragId = useRef<string | null>(null);

  if (todos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center mb-4">
          <ClipboardList className="w-8 h-8 text-indigo-500" />
        </div>
        <p className="text-slate-600 dark:text-slate-300 font-medium">No tasks here</p>
        <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">
          Try adjusting filters or add a new task.
        </p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {todos.map((t) => (
        <TodoItem
          key={t.id}
          todo={t}
          projects={props.projects}
          onToggle={props.onToggle}
          onRemove={props.onRemove}
          onUpdateTitle={props.onUpdateTitle}
          onUpdate={props.onUpdate}
          onAddSubtask={props.onAddSubtask}
          onToggleSubtask={props.onToggleSubtask}
          onRemoveSubtask={props.onRemoveSubtask}
          onTagClick={props.onTagClick}
          onDragStart={(id: string) => {
            dragId.current = id;
          }}
          onDropOn={(id: string) => {
            if (dragId.current && dragId.current !== id) {
              props.onReorder(dragId.current, id);
            }
            dragId.current = null;
          }}
        />
      ))}
    </ul>
  );
}
