import { CreateTaskDto, UpdateTaskDto } from '@/app/models/task.model';
import { TaskService } from '@/app/shared/services/task.services';
import { computed, inject, Injectable } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { initialTaskState } from './task.state';

export const TaskStore = signalStore(
  { providedIn: 'root' },
  withState(initialTaskState),
  withComputed(({ tasks, selectedTask }) => ({
    tasksLoaded: computed(() => tasks().length > 0),
    hasSelectedTask: computed(() => !!selectedTask()),
  })),
  withMethods((store, taskService = inject(TaskService)) => ({
    loadTasks: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(() =>
          taskService.getTasks().pipe(
            tapResponse(
              (tasks) => patchState(store, { tasks, loading: false }),
              (error: Error) =>
                patchState(store, { error: error.message, loading: false })
            )
          )
        )
      )
    ),

    loadTask: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((id) =>
          taskService.getTaskById(id).pipe(
            tapResponse(
              (task) =>
                patchState(store, { selectedTask: task, loading: false }),
              (error: Error) =>
                patchState(store, { error: error.message, loading: false })
            )
          )
        )
      )
    ),

    createTask: rxMethod<CreateTaskDto>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((taskDto) =>
          taskService.createTask(taskDto).pipe(
            tapResponse(
              (createdTask) => {
                const currentTasks = store.tasks();
                patchState(store, {
                  tasks: [...currentTasks, createdTask],
                  loading: false,
                });
              },
              (error: Error) =>
                patchState(store, { error: error.message, loading: false })
            )
          )
        )
      )
    ),

    updateTask: rxMethod<{ id: string; changes: UpdateTaskDto }>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(({ id, changes }) =>
          taskService.updateTask(id, changes).pipe(
            tapResponse(
              (updatedTask) => {
                const currentTasks = store.tasks();
                const updatedTasks = currentTasks.map((task) =>
                  task.id === updatedTask.id ? updatedTask : task
                );
                patchState(store, {
                  tasks: updatedTasks,
                  selectedTask:
                    store.selectedTask()?.id === id
                      ? updatedTask
                      : store.selectedTask(),
                  loading: false,
                });
              },
              (error: Error) =>
                patchState(store, { error: error.message, loading: false })
            )
          )
        )
      )
    ),

    deleteTask: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((id) =>
          taskService.deleteTask(id).pipe(
            tapResponse(
              () => {
                const currentTasks = store.tasks();
                const filteredTasks = currentTasks.filter(
                  (task) => task.id !== id
                );
                patchState(store, {
                  tasks: filteredTasks,
                  selectedTask:
                    store.selectedTask()?.id === id
                      ? null
                      : store.selectedTask(),
                  loading: false,
                });
              },
              (error: Error) =>
                patchState(store, { error: error.message, loading: false })
            )
          )
        )
      )
    ),

    clearSelectedTask: () => {
      patchState(store, { selectedTask: null });
    },
  }))
);

@Injectable({ providedIn: 'root' })
export class TaskStoreService extends TaskStore {}
