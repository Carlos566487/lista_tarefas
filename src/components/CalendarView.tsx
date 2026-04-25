import { useState, useMemo } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format, parseISO, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Task } from '../types';
import { TaskItem } from './TaskItem';

interface CalendarViewProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function CalendarView({ tasks, onToggle, onDelete }: CalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const tasksOnSelectedDate = useMemo(() => {
    return tasks.filter(t => t.dueDate && isSameDay(parseISO(t.dueDate), selectedDate));
  }, [tasks, selectedDate]);

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const hasTask = tasks.some(t => t.dueDate && isSameDay(parseISO(t.dueDate), date));
      if (hasTask) {
        return <div className="flex justify-center mt-1"><div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div></div>;
      }
    }
    return null;
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="glass-panel rounded-3xl p-6 overflow-hidden">
        <style>{`
          .react-calendar {
            width: 100%;
            background: transparent;
            border: none;
            font-family: inherit;
          }
          .react-calendar__navigation button {
            color: var(--text-primary);
            min-width: 44px;
            background: none;
            font-size: 1.1rem;
            font-weight: 600;
          }
          .react-calendar__navigation button:enabled:hover,
          .react-calendar__navigation button:enabled:focus {
            background-color: rgba(0,0,0,0.05);
            border-radius: 12px;
          }
          .react-calendar__month-view__weekdays {
            text-transform: uppercase;
            font-weight: 700;
            font-size: 0.75rem;
            color: var(--text-secondary);
          }
          .react-calendar__month-view__days__day--neighboringMonth {
            color: var(--text-muted) !important;
          }
          .react-calendar__tile {
            height: 80px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            border-radius: 16px;
            color: var(--text-primary);
            transition: all 0.2s;
          }
          .react-calendar__tile:enabled:hover,
          .react-calendar__tile:enabled:focus {
            background-color: rgba(139, 92, 246, 0.1);
            color: #7c3aed;
          }
          .react-calendar__tile--now {
            background: rgba(0,0,0,0.05);
            font-weight: bold;
          }
          .react-calendar__tile--active {
            background: linear-gradient(135deg, #7c3aed, #db2777) !important;
            color: white !important;
            box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
          }
          .react-calendar__tile--active .bg-purple-500 {
            background-color: white;
          }
        `}</style>
        <Calendar
          onChange={(val) => setSelectedDate(val as Date)}
          value={selectedDate}
          locale="pt-BR"
          tileContent={tileContent}
        />
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-xl font-bold text-primary flex items-center gap-2">
          Tarefas para {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
          <span className="text-sm font-medium px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/5 text-secondary">
            {tasksOnSelectedDate.length}
          </span>
        </h3>
        
        <div className="flex flex-col gap-3">
          {tasksOnSelectedDate.length > 0 ? (
            tasksOnSelectedDate.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={onToggle}
                onDelete={onDelete}
              />
            ))
          ) : (
            <div className="glass-panel rounded-3xl p-8 text-center text-secondary text-sm">
              Nenhuma tarefa agendada para este dia.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
