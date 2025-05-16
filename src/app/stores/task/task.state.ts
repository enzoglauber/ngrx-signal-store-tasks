import { Task } from '../../models/task.model';

export interface TaskState {
  tasks: Task[];
  selectedTask: Task | null;
  loading: boolean;
  error: string | null;
}

export const initialTaskState: TaskState = {
  tasks: [],
  selectedTask: null,
  loading: false,
  error: null,
};
