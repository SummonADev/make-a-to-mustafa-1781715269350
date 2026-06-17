import { useEffect, useState, useMemo, useCallback } from 'react';
import type { Todo, FilterMode } from '@/types';
import { loadTodos, saveTodos, makeId } from '@/lib/storage';

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterMode>('all');
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    setTodos(loadTodos());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) saveTodos(todos);
  }, [todos, loaded]);

  const addTodo = useCallback((title: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    const todo: Todo = {
      id: makeId(),
      title: trimmed,
      completed: false,
      createdAt: Date.now(),
    };
    setTodos((prev) => [todo, ...prev]);
  }, []);

  const toggleTodo = useCallback((id: string) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  }, []);

  const removeTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const updateTodo = useCallback((id: string, title: string) => {
    const trimmed = title.trim();
    if (!trimmed) {
      setTodos((prev) => prev.filter((t) => t.id !== id));
      return;
    }
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, title: trimmed } : t)));
  }, []);

  const clearCompleted = useCallback(() => {
    setTodos((prev) => prev.filter((t) => !t.completed));
  }, []);

  const visibleTodos = useMemo(() => {
    if (filter === 'active') return todos.filter((t) => !t.completed);
    if (filter === 'completed') return todos.filter((t) => t.completed);
    return todos;
  }, [todos, filter]);

  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter((t) => t.completed).length;
    const active = total - completed;
    return { total, completed, active };
  }, [todos]);

  return {
    todos,
    visibleTodos,
    filter,
    setFilter,
    addTodo,
    toggleTodo,
    removeTodo,
    updateTodo,
    clearCompleted,
    stats,
  };
}
