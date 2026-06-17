import { useEffect, useState, useMemo, useCallback } from 'react';
import type { Todo, Project, FilterMode, SortMode, Priority, Subtask } from '@/types';
import {
  loadTodos,
  saveTodos,
  loadProjects,
  saveProjects,
  loadPrefs,
  savePrefs,
  makeId,
  type Prefs,
  DEFAULT_PREFS,
} from '@/lib/storage';
import { isOverdue, isToday } from '@/lib/date';

const PRIORITY_RANK: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

const DEFAULT_PROJECTS: Project[] = [
  { id: 'inbox', name: 'Inbox', color: '#6366f1', createdAt: Date.now() },
  { id: 'personal', name: 'Personal', color: '#ec4899', createdAt: Date.now() },
  { id: 'work', name: 'Work', color: '#0ea5e9', createdAt: Date.now() },
];

export type NewTodoInput = {
  title: string;
  notes?: string;
  dueDate?: number | null;
  priority?: Priority;
  tags?: string[];
  projectId?: string;
};

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS);
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    setTodos(loadTodos());
    const p = loadProjects();
    setProjects(p.length ? p : DEFAULT_PROJECTS);
    setPrefs(loadPrefs());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) saveTodos(todos);
  }, [todos, loaded]);

  useEffect(() => {
    if (loaded) saveProjects(projects);
  }, [projects, loaded]);

  useEffect(() => {
    if (loaded) savePrefs(prefs);
  }, [prefs, loaded]);

  useEffect(() => {
    const root = document.documentElement;
    if (prefs.theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
  }, [prefs.theme]);

  // ---------- todo mutations ----------
  const addTodo = useCallback((input: NewTodoInput) => {
    const trimmed = input.title.trim();
    if (!trimmed) return;
    const todo: Todo = {
      id: makeId(),
      title: trimmed,
      notes: input.notes?.trim() || '',
      completed: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      completedAt: null,
      dueDate: input.dueDate ?? null,
      priority: input.priority ?? 'medium',
      tags: (input.tags ?? []).map((t) => t.trim().toLowerCase()).filter(Boolean),
      projectId: input.projectId ?? 'inbox',
      subtasks: [],
      order: Date.now(),
    };
    setTodos((prev) => [todo, ...prev]);
  }, []);

  const toggleTodo = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              completed: !t.completed,
              completedAt: !t.completed ? Date.now() : null,
              updatedAt: Date.now(),
            }
          : t,
      ),
    );
  }, []);

  const removeTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const updateTodo = useCallback((id: string, patch: Partial<Todo>) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...patch, updatedAt: Date.now() } : t)),
    );
  }, []);

  const updateTitle = useCallback((id: string, title: string) => {
    const trimmed = title.trim();
    if (!trimmed) {
      setTodos((prev) => prev.filter((t) => t.id !== id));
      return;
    }
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, title: trimmed, updatedAt: Date.now() } : t)),
    );
  }, []);

  const clearCompleted = useCallback(() => {
    setTodos((prev) => prev.filter((t) => !t.completed));
  }, []);

  const reorderTodos = useCallback((sourceId: string, targetId: string) => {
    setTodos((prev) => {
      const src = prev.find((t) => t.id === sourceId);
      const tgt = prev.find((t) => t.id === targetId);
      if (!src || !tgt || sourceId === targetId) return prev;
      const without = prev.filter((t) => t.id !== sourceId);
      const targetIndex = without.findIndex((t) => t.id === targetId);
      const next = [...without];
      next.splice(targetIndex, 0, src);
      return next.map((t, i) => ({ ...t, order: i }));
    });
  }, []);

  // ---------- subtasks ----------
  const addSubtask = useCallback((todoId: string, title: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    const sub: Subtask = { id: makeId(), title: trimmed, completed: false };
    setTodos((prev) =>
      prev.map((t) =>
        t.id === todoId
          ? { ...t, subtasks: [...t.subtasks, sub], updatedAt: Date.now() }
          : t,
      ),
    );
  }, []);

  const toggleSubtask = useCallback((todoId: string, subId: string) => {
    setTodos((prev) =>
      prev.map((t) =>
        t.id === todoId
          ? {
              ...t,
              subtasks: t.subtasks.map((s) =>
                s.id === subId ? { ...s, completed: !s.completed } : s,
              ),
              updatedAt: Date.now(),
            }
          : t,
      ),
    );
  }, []);

  const removeSubtask = useCallback((todoId: string, subId: string) => {
    setTodos((prev) =>
      prev.map((t) =>
        t.id === todoId
          ? { ...t, subtasks: t.subtasks.filter((s) => s.id !== subId), updatedAt: Date.now() }
          : t,
      ),
    );
  }, []);

  // ---------- projects ----------
  const addProject = useCallback((name: string, color: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const project: Project = {
      id: makeId(),
      name: trimmed,
      color,
      createdAt: Date.now(),
    };
    setProjects((prev) => [...prev, project]);
  }, []);

  const removeProject = useCallback((id: string) => {
    if (id === 'inbox') return;
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setTodos((prev) => prev.map((t) => (t.projectId === id ? { ...t, projectId: 'inbox' } : t)));
  }, []);

  // ---------- prefs ----------
  const setFilter = useCallback((filter: FilterMode) => {
    setPrefs((p) => ({ ...p, filter }));
  }, []);
  const setSort = useCallback((sort: SortMode) => {
    setPrefs((p) => ({ ...p, sort }));
  }, []);
  const setSearch = useCallback((search: string) => {
    setPrefs((p) => ({ ...p, search }));
  }, []);
  const setActiveProjectId = useCallback((id: string | 'all') => {
    setPrefs((p) => ({ ...p, activeProjectId: id }));
  }, []);
  const setActiveTag = useCallback((tag: string | null) => {
    setPrefs((p) => ({ ...p, activeTag: tag }));
  }, []);
  const toggleTheme = useCallback(() => {
    setPrefs((p) => ({ ...p, theme: p.theme === 'dark' ? 'light' : 'dark' }));
  }, []);

  // ---------- derived ----------
  const allTags = useMemo(() => {
    const s = new Set<string>();
    todos.forEach((t) => t.tags.forEach((tag) => s.add(tag)));
    return Array.from(s).sort();
  }, [todos]);

  const projectScoped = useMemo(() => {
    if (prefs.activeProjectId === 'all') return todos;
    return todos.filter((t) => t.projectId === prefs.activeProjectId);
  }, [todos, prefs.activeProjectId]);

  const visibleTodos = useMemo(() => {
    let list = projectScoped;

    if (prefs.filter === 'active') list = list.filter((t) => !t.completed);
    else if (prefs.filter === 'completed') list = list.filter((t) => t.completed);

    if (prefs.activeTag) list = list.filter((t) => t.tags.includes(prefs.activeTag!));

    const q = prefs.search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.notes.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.includes(q)),
      );
    }

    const sorted = [...list];
    switch (prefs.sort) {
      case 'due':
        sorted.sort((a, b) => {
          const ad = a.dueDate ?? Infinity;
          const bd = b.dueDate ?? Infinity;
          return ad - bd;
        });
        break;
      case 'priority':
        sorted.sort((a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority]);
        break;
      case 'alpha':
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'manual':
        sorted.sort((a, b) => a.order - b.order);
        break;
      case 'created':
      default:
        sorted.sort((a, b) => b.createdAt - a.createdAt);
    }

    // Always push completed to the bottom unless explicitly filtered
    if (prefs.filter === 'all') {
      sorted.sort((a, b) => Number(a.completed) - Number(b.completed));
    }

    return sorted;
  }, [projectScoped, prefs]);

  const stats = useMemo(() => {
    const scope = projectScoped;
    const total = scope.length;
    const completed = scope.filter((t) => t.completed).length;
    const active = total - completed;
    const overdue = scope.filter((t) => isOverdue(t.dueDate, t.completed)).length;
    const today = scope.filter((t) => t.dueDate && isToday(t.dueDate) && !t.completed).length;
    return { total, completed, active, overdue, today };
  }, [projectScoped]);

  return {
    todos,
    projects,
    visibleTodos,
    prefs,
    allTags,
    stats,
    // mutations
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
    // prefs setters
    setFilter,
    setSort,
    setSearch,
    setActiveProjectId,
    setActiveTag,
    toggleTheme,
  };
}
