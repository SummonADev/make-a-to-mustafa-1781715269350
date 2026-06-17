import { useMemo } from 'react';
import { CheckCircle2, Moon, Sun } from 'lucide-react';
import TodoInput from '@/components/TodoInput';
import TodoList from '@/components/TodoList';
import FilterBar from '@/components/FilterBar';
import Sidebar from '@/components/Sidebar';
import StatsBar from '@/components/StatsBar';
import { useTodos } from '@/hooks/useTodos';

export default function HomePage() {
  const {
    todos,
    projects,
    visibleTodos,
    prefs,
    allTags,
    stats,
    addTodo,
    toggleTodo,
    removeTodo,
    updateTodo,
    updateTitle,
    clearCompleted,
    reorderTodos,
    addSubtask,
    toggleSubtask,
    removeSubtask,
    addProject,
    removeProject,
    setFilter,
    setSort,
    setSearch,
    setActiveProjectId,
    setActiveTag,
    toggleTheme,
  } = useTodos();

  const projectCounts = useMemo<Record<string, number>>(() => {
    const counts: Record<string, number> = { all: todos.filter((t) => !t.completed).length };
    projects.forEach((p) => {
      counts[p.id] = todos.filter((t) => t.projectId === p.id && !t.completed).length;
    });
    return counts;
  }, [todos, projects]);

  const activeProjectName =
    prefs.activeProjectId === 'all'
      ? 'All tasks'
      : projects.find((p) => p.id === prefs.activeProjectId)?.name ?? 'Tasks';

  return (
    <div className="min-h-screen w-full px-4 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100">
                Tasks
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Organize. Prioritize. Get things done.
              </p>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-white/70 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 shadow-sm hover:shadow-md transition-shadow"
            aria-label="Toggle theme"
          >
            {prefs.theme === 'dark' ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
        </header>

        <div className="flex flex-col lg:flex-row gap-6">
          <Sidebar
            projects={projects}
            activeProjectId={prefs.activeProjectId}
            onSelectProject={setActiveProjectId}
            onAddProject={addProject}
            onRemoveProject={removeProject}
            allTags={allTags}
            activeTag={prefs.activeTag}
            onSelectTag={setActiveTag}
            counts={projectCounts}
          />

          <main className="flex-1 min-w-0 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
                {activeProjectName}
                {prefs.activeTag && (
                  <span className="ml-2 text-sm font-normal text-indigo-600 dark:text-indigo-400">
                    #{prefs.activeTag}
                  </span>
                )}
              </h2>
            </div>

            <StatsBar
              total={stats.total}
              completed={stats.completed}
              active={stats.active}
              overdue={stats.overdue}
              today={stats.today}
            />

            <div className="bg-white/60 dark:bg-slate-800/40 backdrop-blur-md border border-white/60 dark:border-slate-700 rounded-2xl shadow-xl p-5 sm:p-6 space-y-5">
              <TodoInput
                onAdd={addTodo}
                projects={projects}
                defaultProjectId={prefs.activeProjectId}
              />

              <FilterBar
                filter={prefs.filter}
                onFilterChange={setFilter}
                sort={prefs.sort}
                onSortChange={setSort}
                search={prefs.search}
                onSearchChange={setSearch}
                activeCount={stats.active}
                completedCount={stats.completed}
                onClearCompleted={clearCompleted}
              />

              <TodoList
                todos={visibleTodos}
                projects={projects}
                onToggle={toggleTodo}
                onRemove={removeTodo}
                onUpdateTitle={updateTitle}
                onUpdate={updateTodo}
                onAddSubtask={addSubtask}
                onToggleSubtask={toggleSubtask}
                onRemoveSubtask={removeSubtask}
                onTagClick={(tag: string) => setActiveTag(prefs.activeTag === tag ? null : tag)}
                onReorder={reorderTodos}
              />
            </div>

            <footer className="text-center text-xs text-slate-400 dark:text-slate-500">
              Double-click to edit · Drag to reorder · Saved to your browser
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
}
