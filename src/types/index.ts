export type Priority = 'low' | 'medium' | 'high';

export type Theme = 'light' | 'dark';

export type FilterMode = 'all' | 'active' | 'completed';

export type SortMode = 'created' | 'due' | 'priority' | 'alpha' | 'manual';

export type Subtask = {
  id: string;
  title: string;
  completed: boolean;
};

export type Todo = {
  id: string;
  title: string;
  notes: string;
  completed: boolean;
  createdAt: number;
  updatedAt: number;
  completedAt: number | null;
  dueDate: number | null;
  priority: Priority;
  tags: string[];
  projectId: string;
  subtasks: Subtask[];
  order: number;
};

export type Project = {
  id: string;
  name: string;
  color: string;
  createdAt: number;
};

export type AuthProvider = 'google' | 'demo';

export type User = {
  id: string;
  email: string;
  name: string;
  picture: string;
  provider: AuthProvider;
};
