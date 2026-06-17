import { useEffect, useRef, useState } from 'react';
import { LogOut, ChevronDown } from 'lucide-react';
import type { User } from '@/types';

type UserMenuProps = {
  user: User;
  onSignOut: () => void;
};

export default function UserMenu({ user, onSignOut }: UserMenuProps) {
  const [open, setOpen] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-2xl bg-white dark:bg-[#1f1a35] border-2 border-[#1a1530] dark:border-[#f1ecff]/20 shadow-[3px_3px_0_0_#1a1530] dark:shadow-[3px_3px_0_0_#ffd84d] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_0_#1a1530] dark:hover:shadow-[2px_2px_0_0_#ffd84d] transition-all"
        aria-label="Account menu"
      >
        {user.picture ? (
          <img
            src={user.picture}
            alt={user.name}
            referrerPolicy="no-referrer"
            className="w-7 h-7 rounded-full border-2 border-[#1a1530] dark:border-[#ffd84d]"
          />
        ) : (
          <div className="w-7 h-7 rounded-full bg-[#ffd84d] text-[#1a1530] font-black text-xs flex items-center justify-center border-2 border-[#1a1530]">
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}
        <span className="hidden sm:inline text-sm font-bold text-[#1a1530] dark:text-[#f1ecff] max-w-[120px] truncate">
          {user.name.split(' ')[0]}
        </span>
        <ChevronDown className="w-4 h-4 text-[#1a1530] dark:text-[#f1ecff]" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 rounded-2xl border-2 border-[#1a1530] dark:border-[#f1ecff]/20 bg-white dark:bg-[#1f1a35] shadow-[6px_6px_0_0_#1a1530] dark:shadow-[6px_6px_0_0_#ffd84d] p-3 z-30">
          <div className="flex items-center gap-3 p-2">
            {user.picture ? (
              <img
                src={user.picture}
                alt={user.name}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full border-2 border-[#1a1530] dark:border-[#ffd84d]"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#ffd84d] text-[#1a1530] font-black text-base flex items-center justify-center border-2 border-[#1a1530]">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <div className="text-sm font-black text-[#1a1530] dark:text-[#f1ecff] truncate">
                {user.name}
              </div>
              <div className="text-xs font-medium text-[#1a1530]/60 dark:text-[#f1ecff]/60 truncate">
                {user.email}
              </div>
            </div>
          </div>
          <div className="h-px bg-[#1a1530]/10 dark:bg-[#f1ecff]/10 my-2" />
          <button
            onClick={() => {
              setOpen(false);
              onSignOut();
            }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold text-[#1a1530] dark:text-[#f1ecff] hover:bg-[#ff7a59]/20 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
