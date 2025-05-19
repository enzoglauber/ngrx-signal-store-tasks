import { CreateTaskDto, Task, UpdateTaskDto } from '@/app/models/task.model';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const TaskActions = createActionGroup({
  source: 'Task',
  events: {
    // Load tasks
    'Load Tasks': emptyProps(),
    'Load Tasks Success': props<{ tasks: Task[] }>(),
    'Load Tasks Failure': props<{ error: string }>(),

    // Load single task
    'Load Task': props<{ id: string }>(),
    'Load Task Success': props<{ task: Task }>(),
    'Load Task Failure': props<{ error: string }>(),

    // Create task
    'Create Task': props<{ task: CreateTaskDto }>(),
    'Create Task Success': props<{ task: Task }>(),
    'Create Task Failure': props<{ error: string }>(),

    // Update task
    'Update Task': props<{ id: string; changes: UpdateTaskDto }>(),
    'Update Task Success': props<{ task: Task }>(),
    'Update Task Failure': props<{ error: string }>(),

    // Delete task
    'Delete Task': props<{ id: string }>(),
    'Delete Task Success': props<{ id: string }>(),
    'Delete Task Failure': props<{ error: string }>(),

    // Clear selected task
    'Clear Selected Task': emptyProps(),
  },
});
