export type FilterMode = 'all' | 'active' | 'completed';

export type Priority = 'low' | 'medium' | 'high';

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

export type Subtask = {
  id: string;
  title: string;
  completed: boolean;
};

export type Project = {
  id: string;
  name: string;
  color: string;
  createdAt: number;
};

export type SortMode = 'created' | 'due' | 'priority' | 'alpha' | 'manual';

export type Theme = 'light' | 'dark';

export type User = {
  id: string;
  email: string;
  name: string;
  picture: string;
  provider: 'google';
};

// Minimal type surface for the Google Identity Services script.
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              type?: 'standard' | 'icon';
              theme?: 'outline' | 'filled_blue' | 'filled_black';
              size?: 'large' | 'medium' | 'small';
              text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
              shape?: 'rectangular' | 'pill' | 'circle' | 'square';
              logo_alignment?: 'left' | 'center';
              width?: number;
            },
          ) => void;
          prompt: () => void;
          disableAutoSelect: () => void;
          revoke: (hint: string, callback: () => void) => void;
        };
      };
    };
  }
}
