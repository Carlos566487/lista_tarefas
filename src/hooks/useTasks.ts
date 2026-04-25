import { useState, useEffect, useCallback } from 'react';
import type { Task, Priority, Category } from '../types';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

export function useTasks(user: User | null) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTasks = useCallback(async () => {
    if (!user) {
      setTasks([]);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const mappedTasks: Task[] = data.map(item => ({
          id: item.id,
          title: item.title,
          completed: item.completed,
          categoryId: item.category_id as Category,
          priority: item.priority as Priority,
          dueDate: item.due_date,
          createdAt: new Date(item.created_at).getTime(),
        }));
        setTasks(mappedTasks);
      }
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = async (title: string, categoryId: Category, priority: Priority, dueDate: string | null) => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([
          {
            title,
            category_id: categoryId,
            priority,
            due_date: dueDate,
            completed: false,
            user_id: user.id,
          },
        ])
        .select();

      if (error) throw error;

      if (data) {
        const newTask: Task = {
          id: data[0].id,
          title: data[0].title,
          completed: data[0].completed,
          categoryId: data[0].category_id as Category,
          priority: data[0].priority as Priority,
          dueDate: data[0].due_date,
          createdAt: new Date(data[0].created_at).getTime(),
        };
        setTasks(prev => [newTask, ...prev]);
      }
    } catch (error) {
      console.error('Erro ao adicionar tarefa:', error);
    }
  };

  const toggleTask = async (id: string) => {
    const taskToToggle = tasks.find(t => t.id === id);
    if (!taskToToggle) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .update({ completed: !taskToToggle.completed })
        .eq('id', id);

      if (error) throw error;

      setTasks(prev => prev.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      ));
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);
    }
  };

  return { tasks, addTask, toggleTask, deleteTask, isLoading };
}
