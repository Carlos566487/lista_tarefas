import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import type { Task } from '../types';

interface AnalyticsViewProps {
  tasks: Task[];
}

export function AnalyticsView({ tasks }: AnalyticsViewProps) {
  const statusData = useMemo(() => {
    const completed = tasks.filter(t => t.completed).length;
    const pending = tasks.length - completed;
    return [
      { name: 'Concluídas', value: completed, color: '#8b5cf6' },
      { name: 'Pendentes', value: pending, color: '#ec4899' },
    ];
  }, [tasks]);

  const priorityData = useMemo(() => {
    const counts = { alta: 0, media: 0, baixa: 0 };
    tasks.forEach(t => {
      counts[t.priority]++;
    });
    return [
      { name: 'Alta', value: counts.alta, color: '#ef4444' },
      { name: 'Média', value: counts.media, color: '#f59e0b' },
      { name: 'Baixa', value: counts.baixa, color: '#10b981' },
    ];
  }, [tasks]);

  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    tasks.forEach(t => {
      const cat = t.categoryId || 'outros';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({
      name: name.toUpperCase(),
      value,
    }));
  }, [tasks]);

  if (tasks.length === 0) {
    return (
      <div className="glass-panel rounded-3xl p-12 text-center flex flex-col items-center justify-center gap-3">
        <div className="w-16 h-16 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center text-4xl">
          📊
        </div>
        <h3 className="text-xl font-semibold text-primary">Sem dados para análise</h3>
        <p className="text-secondary text-sm">Adicione algumas tarefas para ver as estatísticas.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Status Distribution */}
      <div className="glass-panel rounded-3xl p-6 flex flex-col items-center">
        <h3 className="text-lg font-semibold text-primary mb-4">Status das Tarefas</h3>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Priority Distribution */}
      <div className="glass-panel rounded-3xl p-6 flex flex-col items-center">
        <h3 className="text-lg font-semibold text-primary mb-4">Distribuição por Prioridade</h3>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={priorityData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.1)" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip cursor={{fill: 'rgba(0,0,0,0.05)'}} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Distribution */}
      <div className="glass-panel rounded-3xl p-6 flex flex-col items-center md:col-span-2">
        <h3 className="text-lg font-semibold text-primary mb-4">Tarefas por Categoria</h3>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(0,0,0,0.1)" />
              <XAxis type="number" axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={100} />
              <Tooltip cursor={{fill: 'rgba(0,0,0,0.05)'}} />
              <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
