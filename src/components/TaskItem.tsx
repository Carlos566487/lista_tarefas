import type { Task } from '../types';
import { Calendar, Trash2, Check } from 'lucide-react';
import clsx from 'clsx';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const priorityConfig = {
  alta: {
    label: 'ALTA',
    className: 'bg-red-100 text-red-700 border border-red-200 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30',
  },
  media: {
    label: 'MÉDIA',
    className: 'bg-orange-100 text-orange-700 border border-orange-200 dark:bg-orange-500/20 dark:text-orange-400 dark:border-orange-500/30',
  },
  baixa: {
    label: 'BAIXA',
    className: 'bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30',
  },
} as const;

const categoryConfig: Record<string, { label: string; className: string }> = {
  trabalho: { label: 'TRABALHO', className: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400' },
  pessoal:  { label: 'PESSOAL',  className: 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400' },
  estudos:  { label: 'ESTUDOS',  className: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' },
  outros:   { label: 'OUTROS',   className: 'bg-slate-100 text-slate-600 dark:bg-slate-500/20 dark:text-slate-400' },
};

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  const priority = priorityConfig[task.priority] ?? priorityConfig.baixa;
  const category = categoryConfig[task.categoryId] ?? categoryConfig.outros;

  return (
    <div
      className={clsx(
        'glass-panel rounded-2xl p-4 flex items-center gap-4 group task-enter',
        task.completed ? 'opacity-60' : 'glass-panel-hover',
      )}
    >
      {/* Checkbox customizado */}
      <button
        onClick={() => onToggle(task.id)}
        aria-label={task.completed ? 'Desmarcar tarefa' : 'Marcar como concluída'}
        className={clsx(
          'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all shrink-0',
          task.completed
            ? 'bg-purple-500 border-purple-500 text-white'
            : 'border-slate-400 hover:border-purple-400',
        )}
      >
        {task.completed && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
      </button>

      {/* Conteúdo da tarefa */}
      <div className="flex-1 min-w-0">
        <h3
          className={clsx(
            'font-semibold text-base leading-snug truncate transition-all duration-300',
            task.completed ? 'line-through text-muted' : 'text-primary',
          )}
        >
          {task.title}
        </h3>

        <div className="flex flex-wrap gap-2 mt-2 text-xs font-semibold">
          <span className={clsx('px-2.5 py-0.5 rounded-full', priority.className)}>
            {priority.label}
          </span>
          <span className={clsx('px-2.5 py-0.5 rounded-full', category.className)}>
            {category.label}
          </span>
          {task.dueDate && (
            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/5 dark:bg-white/5 text-secondary">
              <Calendar className="w-3 h-3" />
              {format(parseISO(task.dueDate), "dd 'de' MMM", { locale: ptBR })}
            </span>
          )}
        </div>
      </div>

      {/* Botão de exclusão */}
      <button
        onClick={() => onDelete(task.id)}
        aria-label="Excluir tarefa"
        title="Excluir tarefa"
        className="w-9 h-9 rounded-xl flex items-center justify-center text-muted opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10 dark:hover:text-red-400 transition-all shrink-0"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
