import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isDummy = !supabaseUrl || supabaseUrl.includes('dummy-url') || !supabaseAnonKey || supabaseAnonKey === 'your-anon-key';

// Mock implementation to allow local testing without real Supabase keys
const mockSupabase = {
  auth: {
    getSession: async () => {
      const session = JSON.parse(localStorage.getItem('mock_session') || 'null');
      return { data: { session }, error: null };
    },
    onAuthStateChange: (callback: any) => {
      const handleStorage = () => {
        const session = JSON.parse(localStorage.getItem('mock_session') || 'null');
        callback('SIGNED_IN', session);
      };
      window.addEventListener('storage', handleStorage);
      // Trigger initial call
      setTimeout(handleStorage, 0);
      return { data: { subscription: { unsubscribe: () => window.removeEventListener('storage', handleStorage) } } };
    },
    signUp: async ({ email, password, options }: any) => {
      const user = { 
        id: 'mock-user-id', 
        email, 
        user_metadata: options?.data || { full_name: 'Usuário de Teste' },
        aud: 'authenticated',
        role: 'authenticated'
      };
      const session = { user, access_token: 'mock-token', refresh_token: 'mock-refresh' };
      localStorage.setItem('mock_session', JSON.stringify(session));
      window.dispatchEvent(new Event('storage'));
      return { data: { user, session }, error: null };
    },
    signInWithPassword: async ({ email, password }: any) => {
      // For mock purposes, we'll accept any login
      const user = { 
        id: 'mock-user-id', 
        email, 
        user_metadata: { full_name: email.split('@')[0] },
        aud: 'authenticated',
        role: 'authenticated'
      };
      const session = { user, access_token: 'mock-token', refresh_token: 'mock-refresh' };
      localStorage.setItem('mock_session', JSON.stringify(session));
      window.dispatchEvent(new Event('storage'));
      return { data: { user, session }, error: null };
    },
    signOut: async () => {
      localStorage.removeItem('mock_session');
      window.dispatchEvent(new Event('storage'));
      return { error: null };
    }
  },
  from: (table: string) => ({
    select: () => ({
      order: (column: string, { ascending }: { ascending: boolean } = { ascending: true }) => {
        let data = JSON.parse(localStorage.getItem(`mock_${table}`) || '[]');
        data.sort((a: any, b: any) => {
          const valA = a[column];
          const valB = b[column];
          return ascending ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
        });
        return Promise.resolve({ data, error: null });
      }
    }),
    insert: (items: any[]) => ({
      select: () => {
        const existing = JSON.parse(localStorage.getItem(`mock_${table}`) || '[]');
        const newItems = items.map(item => ({ 
          ...item, 
          id: crypto.randomUUID(), 
          created_at: new Date().toISOString() 
        }));
        localStorage.setItem(`mock_${table}`, JSON.stringify([...newItems, ...existing]));
        return Promise.resolve({ data: newItems, error: null });
      }
    }),
    update: (updates: any) => ({
      eq: (column: string, value: any) => {
        let existing = JSON.parse(localStorage.getItem(`mock_${table}`) || '[]');
        existing = existing.map((item: any) => item[column] === value ? { ...item, ...updates } : item);
        localStorage.setItem(`mock_${table}`, JSON.stringify(existing));
        return Promise.resolve({ error: null });
      }
    }),
    delete: () => ({
      eq: (column: string, value: any) => {
        let existing = JSON.parse(localStorage.getItem(`mock_${table}`) || '[]');
        existing = existing.filter((item: any) => item[column] !== value);
        localStorage.setItem(`mock_${table}`, JSON.stringify(existing));
        return Promise.resolve({ error: null });
      }
    })
  })
} as any;

export const supabase = isDummy ? mockSupabase : createClient(supabaseUrl, supabaseAnonKey);
