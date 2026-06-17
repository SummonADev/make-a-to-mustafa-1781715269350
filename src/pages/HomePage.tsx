import { CheckCircle2 } from 'lucide-react';
import TodoInput from '@/components/TodoInput';
import TodoList from '@/components/TodoList';
import FilterBar from '@/components/FilterBar';
import { useTodos } from '@/hooks/useTodos';

export default function HomePage() {
  const {
    visibleTodos,
    filter,
    setFilter,
    addTodo,
    toggleTodo,
    removeTodo,
    updateTodo,
    clearCompleted,
    stats,
  } = useTodos();

  const progress = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className="min-h-screen w-full flex items-start sm:items-center justify-center px-4 py-10 sm:py-16">
      <div className="w-full max-w-2xl">
        <header className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center shadow-lg">
            <CheckCircle2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Tasks</h1>
            <p className="text-sm text-slate-500">A simple, beautiful to-do app.</p>
          </div>
        </header>

        <div className="bg-white/60 backdrop-blur-md border border-white/60 rounded-2xl shadow-xl p-5 sm:p-6 space-y-5">
          <TodoInput onAdd={addTodo} />

          {stats.total > 0 && (
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Progress</span>
                <span>
                  {stats.completed} / {stats.total}
                </span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <FilterBar
            filter={filter}
            onChange={setFilter}
            activeCount={stats.active}
            completedCount={stats.completed}
            onClearCompleted={clearCompleted}
          />

          <TodoList
            todos={visibleTodos}
            onToggle={toggleTodo}
            onRemove={removeTodo}
            onUpdate={updateTodo}
          />
        </div>

        <footer className="text-center text-xs text-slate-400 mt-6">
          Double-click a task to edit · Saved to your browser
        </footer>
      </div>
    </div>
  );
}
