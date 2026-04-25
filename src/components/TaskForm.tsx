import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import type { Priority, Category } from '../types';

interface TaskFormProps {
  onAdd: (title: string, categoryId: Category, priority: Priority, dueDate: string | null) => void;
}

const selectClass =
  'bg-black/5 dark:bg-white/5 border border-transparent hover:border-black/10 dark:hover:border-white/10 rounded-lg px-3 py-2 text-sm font-medium outline-none text-secondary cursor-pointer transition-colors focus:border-purple-400 dark:focus:border-purple-500';

export function TaskForm({ onAdd }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState<Category>('trabalho');
  const [priority, setPriority] = useState<Priority>('media');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd(title.trim(), categoryId, priority, dueDate || null);
    setTitle('');
    setDueDate('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-panel rounded-3xl p-6 mb-8 flex flex-col gap-4"
      aria-label="Formulário para adicionar nova tarefa"
    >
      <input
        type="text"
        id="task-title"
        placeholder="Adicione uma nova tarefa..."
        className="w-full bg-transparent border-none outline-none text-xl font-heading placeholder:text-muted text-primary"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        autoComplete="off"
        maxLength={120}
      />

      <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-black/5 dark:border-white/10">
        {/* Categoria */}
        <label className="sr-only" htmlFor="task-category">Categoria</label>
        <select
          id="task-category"
          className={selectClass}
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value as Category)}
        >
          <option value="trabalho">💼 Trabalho</option>
          <option value="pessoal">🏠 Pessoal</option>
          <option value="estudos">📚 Estudos</option>
          <option value="outros">📌 Outros</option>
        </select>

        {/* Prioridade */}
        <label className="sr-only" htmlFor="task-priority">Prioridade</label>
        <select
          id="task-priority"
          className={selectClass}
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
        >
          <option value="baixa">🟢 Baixa</option>
          <option value="media">🟡 Média</option>
          <option value="alta">🔴 Alta</option>
        </select>

        {/* Data */}
        <label className="sr-only" htmlFor="task-date">Data de vencimento</label>
        <input
          id="task-date"
          type="date"
          className={`${selectClass} [color-scheme:light] dark:[color-scheme:dark]`}
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        {/* Submit */}
        <button
          type="submit"
          disabled={!title.trim()}
          className="ml-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl px-5 py-2 font-semibold flex items-center gap-2 shadow-lg shadow-purple-500/25 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
        >
          <PlusCircle className="w-5 h-5" />
          Adicionar
        </button>
      </div>
    </form>
  );
}
