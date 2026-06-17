import { useRef } from 'react';
import type { Todo, Project } from '@/types';
import TodoItem from '@/components/TodoItem';
import { Sparkles } from 'lucide-react';

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
        <div className="w-20 h-20 rounded-3xl bg-[#ffd84d] border-2 border-[#1a1530] shadow-[4px_4px_0_0_#1a1530] flex items-center justify-center mb-4 rotate-[-6deg]">
          <Sparkles className="w-9 h-9 text-[#1a1530]" />
        </div>
        <p className="text-[#1a1530] dark:text-[#f1ecff] font-black text-lg" style={{ fontFamily: 'Fraunces, serif' }}>
          You're all clear!
        </p>
        <p className="text-[#1a1530]/60 dark:text-[#f1ecff]/60 text-sm font-medium mt-1">
          Add a tiny next step and get unstuck.
        </p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
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
