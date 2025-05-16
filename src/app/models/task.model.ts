export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateTaskDto = Omit<Task, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateTaskDto = Partial<
  Omit<Task, 'id' | 'createdAt' | 'updatedAt'>
>;
