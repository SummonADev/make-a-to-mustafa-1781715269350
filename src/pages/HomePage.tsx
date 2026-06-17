import { useMemo } from 'react';
import { Sparkles, Moon, Sun, Zap } from 'lucide-react';
import TodoInput from '@/components/TodoInput';
import TodoList from '@/components/TodoList';
import FilterBar from '@/components/FilterBar';
import Sidebar from '@/components/Sidebar';
import StatsBar from '@/components/StatsBar';
import UserMenu from '@/components/UserMenu';
import { useTodos } from '@/hooks/useTodos';
import type { User } from '@/types';

type HomePageProps = {
  user: User;
  onSignOut: () => void;
};

export default function HomePage({ user, onSignOut }: HomePageProps) {
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
      ? 'Everything'
      : projects.find((p) => p.id === prefs.activeProjectId)?.name ?? 'Tasks';

  return (
    <div className="min-h-screen w-full px-4 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="relative w-14 h-14 rounded-2xl bg-[#1a1530] dark:bg-[#ffd84d] flex items-center justify-center shadow-[6px_6px_0_0_#ffd84d] dark:shadow-[6px_6px_0_0_#ff7a59] rotate-[-4deg]">
              <Zap className="w-7 h-7 text-[#ffd84d] dark:text-[#1a1530] fill-current" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#1a1530] dark:text-[#f1ecff]" style={{ fontFamily: 'Fraunces, serif' }}>
                unstuck<span className="text-[#ff7a59]">.</span>
              </h1>
              <p className="text-sm font-medium text-[#1a1530]/60 dark:text-[#f1ecff]/60">
                Hey {user.name.split(' ')[0]} — stop overthinking. Start doing.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-3 rounded-2xl bg-white dark:bg-[#1f1a35] border-2 border-[#1a1530] dark:border-[#f1ecff]/20 text-[#1a1530] dark:text-[#ffd84d] shadow-[3px_3px_0_0_#1a1530] dark:shadow-[3px_3px_0_0_#ffd84d] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_0_#1a1530] dark:hover:shadow-[2px_2px_0_0_#ffd84d] transition-all"
              aria-label="Toggle theme"
            >
              {prefs.theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
            <UserMenu user={user} onSignOut={onSignOut} />
          </div>
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
              <h2 className="text-2xl font-black text-[#1a1530] dark:text-[#f1ecff] flex items-center gap-2" style={{ fontFamily: 'Fraunces, serif' }}>
                <Sparkles className="w-5 h-5 text-[#ff7a59]" />
                {activeProjectName}
                {prefs.activeTag && (
                  <span className="ml-2 text-sm font-bold text-[#6e56ff] dark:text-[#c9b8ff] bg-[#c9b8ff]/30 dark:bg-[#6e56ff]/30 px-2 py-1 rounded-full">
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

            <div className="bg-white dark:bg-[#1f1a35] border-2 border-[#1a1530] dark:border-[#f1ecff]/20 rounded-3xl shadow-[8px_8px_0_0_#1a1530] dark:shadow-[8px_8px_0_0_#ffd84d] p-5 sm:p-6 space-y-5">
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

            <footer className="text-center text-xs font-medium text-[#1a1530]/50 dark:text-[#f1ecff]/50">
              Double-click to edit · Drag to reorder · Saved locally · Keep going ✨
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
}
