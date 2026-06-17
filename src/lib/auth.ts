import type { User } from '@/types';

const USER_KEY = 'todo-app:user:v1';

export function loadUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function saveUser(user: User | null): void {
  try {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);
  } catch {
    // ignore
  }
}

// Decodes a Google ID token (JWT) payload without verifying the signature.
// Verification happens server-side normally; for a client-only demo we trust
// what Google sent back via the GIS popup.
export function decodeJwt<T = Record<string, unknown>>(token: string): T | null {
  try {
    const payload = token.split('.')[1];
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    const decoded = decodeURIComponent(
      json
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );
    return JSON.parse(decoded) as T;
  } catch {
    return null;
  }
}

type GooglePayload = {
  sub: string;
  email: string;
  name: string;
  picture: string;
  email_verified?: boolean;
};

export function userFromGoogleCredential(credential: string): User | null {
  const payload = decodeJwt<GooglePayload>(credential);
  if (!payload) return null;
  return {
    id: payload.sub,
    email: payload.email,
    name: payload.name,
    picture: payload.picture,
    provider: 'google',
  };
}
