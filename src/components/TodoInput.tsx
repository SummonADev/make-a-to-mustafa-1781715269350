import { useState } from 'react';
import { Plus } from 'lucide-react';

type TodoInputProps = {
  onAdd: (title: string) => void;
};

export default function TodoInput({ onAdd }: TodoInputProps) {
  const [value, setValue] = useState<string>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!value.trim()) return;
    onAdd(value);
    setValue('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-center">
      <input
        type="text"
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
        placeholder="What needs to be done?"
        className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-white/70 backdrop-blur focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-slate-800 placeholder-slate-400 shadow-sm"
      />
      <button
        type="submit"
        disabled={!value.trim()}
        className="px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium flex items-center gap-1 shadow-sm transition-colors"
      >
        <Plus className="w-5 h-5" />
        <span className="hidden sm:inline">Add</span>
      </button>
    </form>
  );
}
