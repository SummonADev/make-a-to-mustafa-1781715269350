import { useEffect, useRef } from 'react';
import { Zap, Sparkles, Lock } from 'lucide-react';

type SignInScreenProps = {
  clientId: string | undefined;
  scriptLoaded: boolean;
  renderButton: (el: HTMLElement | null) => void;
};

export default function SignInScreen({
  clientId,
  scriptLoaded,
  renderButton,
}: SignInScreenProps) {
  const btnRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scriptLoaded && btnRef.current) {
      renderButton(btnRef.current);
    }
  }, [scriptLoaded, renderButton]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-[#1f1a35] border-2 border-[#1a1530] dark:border-[#f1ecff]/20 rounded-3xl shadow-[10px_10px_0_0_#ffd84d] dark:shadow-[10px_10px_0_0_#ff7a59] p-8 sm:p-10 space-y-6">
          <div className="flex items-center gap-3">
            <div className="relative w-14 h-14 rounded-2xl bg-[#1a1530] dark:bg-[#ffd84d] flex items-center justify-center shadow-[6px_6px_0_0_#ffd84d] dark:shadow-[6px_6px_0_0_#ff7a59] rotate-[-4deg]">
              <Zap className="w-7 h-7 text-[#ffd84d] dark:text-[#1a1530] fill-current" />
            </div>
            <div>
              <h1
                className="text-3xl font-black tracking-tight text-[#1a1530] dark:text-[#f1ecff]"
                style={{ fontFamily: 'Fraunces, serif' }}
              >
                unstuck<span className="text-[#ff7a59]">.</span>
              </h1>
              <p className="text-sm font-medium text-[#1a1530]/60 dark:text-[#f1ecff]/60">
                Stop overthinking. Start doing.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h2
              className="text-2xl font-black text-[#1a1530] dark:text-[#f1ecff] flex items-center gap-2"
              style={{ fontFamily: 'Fraunces, serif' }}
            >
              <Sparkles className="w-5 h-5 text-[#ff7a59]" />
              Welcome back
            </h2>
            <p className="text-sm text-[#1a1530]/70 dark:text-[#f1ecff]/70 leading-relaxed">
              Sign in with Google to keep your tasks in one place. Your data stays on this device —
              we only use Google to know it's you.
            </p>
          </div>

          {clientId ? (
            <div className="space-y-3">
              <div
                ref={btnRef}
                className="flex justify-center min-h-[44px] items-center"
                aria-label="Sign in with Google"
              />
              {!scriptLoaded && (
                <p className="text-xs text-center font-medium text-[#1a1530]/50 dark:text-[#f1ecff]/50">
                  Loading Google Sign-In…
                </p>
              )}
            </div>
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-[#ff7a59] bg-[#ff7a59]/10 p-4 space-y-2">
              <div className="flex items-center gap-2 text-[#1a1530] dark:text-[#f1ecff] font-bold text-sm">
                <Lock className="w-4 h-4 text-[#ff7a59]" />
                Google Client ID missing
              </div>
              <p className="text-xs text-[#1a1530]/70 dark:text-[#f1ecff]/70 leading-relaxed">
                Add{' '}
                <code className="px-1.5 py-0.5 rounded bg-[#1a1530] text-[#ffd84d] font-mono">
                  VITE_GOOGLE_CLIENT_ID
                </code>{' '}
                to your <code className="font-mono">.env</code> file, then restart the dev server.
                Create one at{' '}
                <a
                  className="underline font-semibold text-[#6e56ff]"
                  href="https://console.cloud.google.com/apis/credentials"
                  target="_blank"
                  rel="noreferrer"
                >
                  Google Cloud Console
                </a>
                .
              </p>
            </div>
          )}

          <div className="text-center text-xs font-medium text-[#1a1530]/50 dark:text-[#f1ecff]/50">
            By continuing, you agree to be awesome today ✨
          </div>
        </div>
      </div>
    </div>
  );
}
