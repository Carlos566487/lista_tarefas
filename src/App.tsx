import { useState, useMemo } from 'react';
import { Header } from './components/Header';
import type { TabType } from './components/Header';
import { TaskForm } from './components/TaskForm';
import { TaskFilters } from './components/TaskFilters';
import type { FilterType } from './components/TaskFilters';
import { TaskItem } from './components/TaskItem';
import { useTasks } from './hooks/useTasks';
import { AnalyticsView } from './components/AnalyticsView';
import { CalendarView } from './components/CalendarView';
import { ProgressBar } from './components/ProgressBar';
import { useAuth } from './hooks/useAuth';
import { AuthPage } from './components/AuthPage';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Bom dia';
  if (hour >= 12 && hour < 18) return 'Boa tarde';
  return 'Boa noite';
}

const EMPTY_MESSAGES: Record<FilterType, string> = {
  todas:      'Você ainda não tem nenhuma tarefa.\nAdicione uma acima para começar!',
  pendentes:  'Nenhuma tarefa pendente. 🎉\nTudo em dia!',
  concluidas: 'Nenhuma tarefa concluída ainda.\nMãos à obra!',
};

function App() {
  const { user, loading: authLoading, signIn, signUp, signOut } = useAuth();
  const { tasks, addTask, toggleTask, deleteTask, isLoading: tasksLoading } = useTasks(user);
  const [filter, setFilter] = useState<FilterType>('todas');
  const [activeTab, setActiveTab] = useState<TabType>('tasks');

  const counts = useMemo(() => ({
    todas:      tasks.length,
    pendentes:  tasks.filter(t => !t.completed).length,
    concluidas: tasks.filter(t => t.completed).length,
  }), [tasks]);

  const completionPercentage = useMemo(() => {
    if (tasks.length === 0) return 0;
    return (counts.concluidas / counts.todas) * 100;
  }, [tasks, counts]);

  const filteredTasks = useMemo(() => tasks.filter(task => {
    if (filter === 'pendentes')  return !task.completed;
    if (filter === 'concluidas') return task.completed;
    return true;
  }), [tasks, filter]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080b14]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
          <p className="text-purple-300 font-medium animate-pulse">Iniciando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage onSignIn={signIn} onSignUp={signUp} />;
  }

  const renderContent = () => {
    if (tasksLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
          <p className="text-secondary font-medium animate-pulse">Carregando suas tarefas...</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'analytics':
        return <AnalyticsView tasks={tasks} />;
      case 'calendar':
        return (
          <CalendarView 
            tasks={tasks} 
            onToggle={toggleTask} 
            onDelete={deleteTask} 
          />
        );
      default:
        return (
          <>
            {/* Formulário */}
            <TaskForm onAdd={addTask} />

            {/* Filtros com contadores */}
            <TaskFilters filter={filter} counts={counts} onFilterChange={setFilter} />

            {/* Lista de tarefas */}
            <div className="flex flex-col gap-3" role="list" aria-label="Lista de tarefas">
              {filteredTasks.length > 0 ? (
                filteredTasks.map(task => (
                  <div key={task.id} role="listitem">
                    <TaskItem
                      task={task}
                      onToggle={toggleTask}
                      onDelete={deleteTask}
                    />
                  </div>
                ))
              ) : (
                <div className="glass-panel rounded-3xl p-12 text-center flex flex-col items-center justify-center gap-3">
                  <div className="w-16 h-16 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center text-4xl">
                    📭
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-primary mb-1">
                      Nenhuma tarefa encontrada
                    </h3>
                    <p className="text-secondary text-sm whitespace-pre-line">
                      {EMPTY_MESSAGES[filter]}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen">
      <Header 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        onSignOut={signOut}
        userName={user.user_metadata?.full_name}
      />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pb-24">
        {/* Cabeçalho da página */}
        <div className="mb-10">
          <h1
            className="text-4xl sm:text-5xl font-heading font-bold mb-2"
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #db2777)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {getGreeting()}, {user.user_metadata?.full_name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-secondary text-lg">
            {activeTab === 'tasks' ? (
              counts.pendentes > 0
                ? `Você tem ${counts.pendentes} tarefa${counts.pendentes > 1 ? 's' : ''} pendente${counts.pendentes > 1 ? 's' : ''}.`
                : 'Você está em dia com todas as tarefas! 🎉'
            ) : activeTab === 'analytics' ? (
              'Veja o desempenho das suas tarefas.'
            ) : (
              'Organize sua rotina pelo calendário.'
            )}
          </p>
        </div>

        <ProgressBar percentage={completionPercentage} />

        {renderContent()}
      </main>
    </div>
  );
}

export default App;
