import clsx from 'clsx';

export type FilterType = 'todas' | 'pendentes' | 'concluidas';

interface TaskFiltersProps {
  filter: FilterType;
  counts: { todas: number; pendentes: number; concluidas: number };
  onFilterChange: (f: FilterType) => void;
}

const options: { id: FilterType; label: string }[] = [
  { id: 'todas',     label: 'Todas'      },
  { id: 'pendentes', label: 'Pendentes'  },
  { id: 'concluidas',label: 'Concluídas' },
];

export function TaskFilters({ filter, counts, onFilterChange }: TaskFiltersProps) {
  return (
    <div
      role="tablist"
      aria-label="Filtrar tarefas"
      className="flex items-center gap-1 mb-6 bg-black/5 dark:bg-white/5 p-1.5 rounded-2xl w-fit"
    >
      {options.map(opt => (
        <button
          key={opt.id}
          role="tab"
          aria-selected={filter === opt.id}
          onClick={() => onFilterChange(opt.id)}
          className={clsx(
            'px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all duration-200',
            filter === opt.id
              ? 'bg-white dark:bg-white/10 text-purple-700 dark:text-purple-300 shadow-sm'
              : 'text-secondary hover:text-primary hover:bg-black/5 dark:hover:bg-white/5',
          )}
        >
          {opt.label}
          <span className={clsx(
            'text-xs px-1.5 py-0.5 rounded-full font-bold',
            filter === opt.id
              ? 'bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-300'
              : 'bg-black/10 dark:bg-white/10 text-secondary',
          )}>
            {counts[opt.id]}
          </span>
        </button>
      ))}
    </div>
  );
}
