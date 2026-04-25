import { CheckSquare, BarChart2, Calendar as CalendarIcon, LogOut } from 'lucide-react';

export type TabType = 'tasks' | 'analytics' | 'calendar';

interface HeaderProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onSignOut: () => void;
  userName?: string;
}

const navItems: { icon: any; label: string; id: TabType }[] = [
  { icon: CheckSquare, label: 'Tarefas', id: 'tasks' },
  { icon: BarChart2, label: 'Análises', id: 'analytics' },
  { icon: CalendarIcon, label: 'Calendário', id: 'calendar' },
];

export function Header({ activeTab, onTabChange, onSignOut, userName }: HeaderProps) {
  return (
    <header className="glass-panel sticky top-0 z-50 border-b border-white/20 mb-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
            <CheckSquare className="w-4.5 h-4.5 text-white" />
          </div>
          <span
            className="font-heading font-bold text-xl tracking-tight"
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #db2777)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            TaskFlow
          </span>
        </div>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Navegação principal">
          {navItems.map(({ icon: Icon, label, id }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => onTabChange(id)}
                className={[
                  'px-4 py-2 rounded-xl font-medium text-sm flex items-center gap-2 transition-all',
                  active
                    ? 'text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/40'
                    : 'text-secondary hover:text-purple-600 dark:hover:text-purple-300 hover:bg-black/5 dark:hover:bg-white/5',
                ].join(' ')}
                aria-current={active ? 'page' : undefined}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            );
          })}
        </nav>

        {/* Usuário e Sair */}
        <div className="flex items-center gap-4">
          {userName && (
            <span className="hidden lg:inline text-sm font-medium text-secondary">
              Olá, <span className="text-primary">{userName}</span>
            </span>
          )}
          <button
            onClick={onSignOut}
            className="flex items-center gap-2 text-sm font-medium text-secondary hover:text-red-500 transition-colors"
            aria-label="Sair da conta"
          >
            <span className="hidden sm:inline">Sair</span>
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
