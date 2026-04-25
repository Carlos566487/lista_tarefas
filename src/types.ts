export type Priority = 'alta' | 'media' | 'baixa';
export type Category = 'trabalho' | 'pessoal' | 'estudos' | string;

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  categoryId: Category;
  priority: Priority;
  dueDate: string | null;
  createdAt: number;
}
