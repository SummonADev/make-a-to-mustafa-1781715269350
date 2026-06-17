import { useCallback, useEffect, useRef, useState } from 'react';
import type { User } from '@/types';
import { loadUser, saveUser, userFromGoogleCredential } from '@/lib/auth';

const GIS_SRC = 'https://accounts.google.com/gsi/client';

function loadGoogleScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return reject(new Error('no window'));
    if (window.google?.accounts?.id) return resolve();
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${GIS_SRC}"]`,
    );
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('script error')));
      return;
    }
    const s = document.createElement('script');
    s.src = GIS_SRC;
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('script error'));
    document.head.appendChild(s);
  });
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState<boolean>(false);
  const [scriptLoaded, setScriptLoaded] = useState<boolean>(false);
  const initializedRef = useRef<boolean>(false);

  const clientId: string | undefined = import.meta.env.VITE_GOOGLE_CLIENT_ID as
    | string
    | undefined;

  // Hydrate from localStorage on mount.
  useEffect(() => {
    setUser(loadUser());
    setReady(true);
  }, []);

  const handleCredential = useCallback((response: { credential: string }) => {
    const u = userFromGoogleCredential(response.credential);
    if (u) {
      setUser(u);
      saveUser(u);
    }
  }, []);

  // Load the GIS script and initialize once we know the client id.
  useEffect(() => {
    if (!clientId) return;
    let cancelled = false;
    loadGoogleScript()
      .then(() => {
        if (cancelled) return;
        if (!window.google?.accounts?.id) return;
        if (!initializedRef.current) {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: handleCredential,
            auto_select: false,
            cancel_on_tap_outside: true,
          });
          initializedRef.current = true;
        }
        setScriptLoaded(true);
      })
      .catch(() => {
        // ignore — UI will show fallback state
      });
    return () => {
      cancelled = true;
    };
  }, [clientId, handleCredential]);

  const renderButton = useCallback(
    (el: HTMLElement | null) => {
      if (!el || !scriptLoaded || !window.google?.accounts?.id) return;
      el.innerHTML = '';
      window.google.accounts.id.renderButton(el, {
        type: 'standard',
        theme: 'filled_black',
        size: 'large',
        text: 'signin_with',
        shape: 'pill',
        logo_alignment: 'left',
      });
    },
    [scriptLoaded],
  );

  const promptOneTap = useCallback(() => {
    if (scriptLoaded && window.google?.accounts?.id) {
      window.google.accounts.id.prompt();
    }
  }, [scriptLoaded]);

  const signOut = useCallback(() => {
    if (window.google?.accounts?.id) {
      window.google.accounts.id.disableAutoSelect();
    }
    setUser(null);
    saveUser(null);
  }, []);

  return {
    user,
    ready,
    scriptLoaded,
    clientId,
    renderButton,
    promptOneTap,
    signOut,
  };
}
