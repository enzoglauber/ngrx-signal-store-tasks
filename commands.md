## Projeto Angular com CRUD de Tasks usando NgRx

### 1. Criação do projeto
```bash
ng new ngrx-tasks --routing --style=scss
cd ngrx-tasks
```

### 2. Instalação do NgRx
```bash
ng add @ngrx/store@latest
ng add @ngrx/effects@latest
ng add @ngrx/entity@latest
ng add @ngrx/store-devtools@latest
```

### 3. Gerar módulo de features
```bash
ng generate module tasks --route tasks --module app
ng generate component tasks/components/task-list
ng generate component tasks/components/task-form
ng generate service tasks/services/tasks-api
```

### 4. Modelo da Task
```ts
// src/app/tasks/models/task.model.ts
export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}
```

### 5. Actions
```ts
// src/app/tasks/state/tasks.actions.ts
import { createAction, props } from '@ngrx/store';
import { Task } from '../models/task.model';

export const loadTasks = createAction('[Tasks] Load Tasks');
export const loadTasksSuccess = createAction('[Tasks] Load Tasks Success', props<{ tasks: Task[] }>());
export const loadTasksFailure = createAction('[Tasks] Load Tasks Failure', props<{ error: any }>());

export const addTask = createAction('[Tasks] Add Task', props<{ task: Task }>());
export const updateTask = createAction('[Tasks] Update Task', props<{ task: Task }>());
export const deleteTask = createAction('[Tasks] Delete Task', props<{ id: string }>());
```

### 6. Reducer
```ts
// src/app/tasks/state/tasks.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { Task } from '../models/task.model';
import * as TaskActions from './tasks.actions';

export interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: any;
}

export const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
};

export const taskReducer = createReducer(
  initialState,
  on(TaskActions.loadTasks, (state) => ({ ...state, loading: true })),
  on(TaskActions.loadTasksSuccess, (state, { tasks }) => ({ ...state, tasks, loading: false })),
  on(TaskActions.loadTasksFailure, (state, { error }) => ({ ...state, error, loading: false })),
  on(TaskActions.addTask, (state, { task }) => ({ ...state, tasks: [...state.tasks, task] })),
  on(TaskActions.updateTask, (state, { task }) => ({
    ...state,
    tasks: state.tasks.map(t => t.id === task.id ? task : t),
  })),
  on(TaskActions.deleteTask, (state, { id }) => ({
    ...state,
    tasks: state.tasks.filter(t => t.id !== id),
  }))
);
```

### 7. Selectors
```ts
// src/app/tasks/state/tasks.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TaskState } from './tasks.reducer';

export const selectTaskState = createFeatureSelector<TaskState>('tasks');

export const selectAllTasks = createSelector(
  selectTaskState,
  (state) => state.tasks
);

export const selectLoading = createSelector(
  selectTaskState,
  (state) => state.loading
);
```

### 8. Effects
```ts
// src/app/tasks/state/tasks.effects.ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TasksApiService } from '../services/tasks-api.service';
import * as TaskActions from './tasks.actions';
import { catchError, map, mergeMap, of } from 'rxjs';

@Injectable()
export class TaskEffects {
  constructor(private actions$: Actions, private api: TasksApiService) {}

  loadTasks$ = createEffect(() => this.actions$.pipe(
    ofType(TaskActions.loadTasks),
    mergeMap(() => this.api.getAll().pipe(
      map(tasks => TaskActions.loadTasksSuccess({ tasks })),
      catchError(error => of(TaskActions.loadTasksFailure({ error })))
    ))
  ));
}
```

### 9. Service
```ts
// src/app/tasks/services/tasks-api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';

@Injectable({ providedIn: 'root' })
export class TasksApiService {
  private baseUrl = 'http://localhost:3000/tasks';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Task[]> {
    return this.http.get<Task[]>(this.baseUrl);
  }

  // Métodos para POST, PUT e DELETE também podem ser adicionados
}
```

### 10. Integração no módulo principal
```ts
// src/app/tasks/tasks.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { taskReducer } from './state/tasks.reducer';
import { TaskEffects } from './state/tasks.effects';
import { TaskListComponent } from './components/task-list.component';
import { TaskFormComponent } from './components/task-form.component';

@NgModule({
  declarations: [TaskListComponent, TaskFormComponent],
  imports: [
    CommonModule,
    StoreModule.forFeature('tasks', taskReducer),
    EffectsModule.forFeature([TaskEffects])
  ]
})
export class TasksModule {}
```

---


## Projeto Angular com CRUD de Tasks usando Signal Store (moderno)

### 1. Criar o projeto
```bash
ng new signals-tasks --routing --style=scss

cd signals-tasks
```

### 2. Instalar Signal Store
```bash
npm install @ngrx/signals @ngrx/store @ngrx/effects @ngrx/store-devtools
```

### 3. Gerar módulo de features
```bash
ng generate module tasks --route tasks --module app.config.ts
ng generate component tasks/pages/task-list
ng generate component tasks/pages/task-form
ng generate service tasks/services/tasks-api
```

### 4. Modelo da Task
```ts
// src/app/tasks/models/task.model.ts
export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}
```

### 5. Criar Store com Signals
```ts
// src/app/tasks/state/tasks.store.ts
import { computed, inject, signal } from '@angular/core';
import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';
import { TasksApiService } from '../services/tasks-api.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { effect } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TasksStore {
  private api = inject(TasksApiService);

  private _tasks = signal<Task[]>([]);
  private _loading = signal(false);
  private _error = signal<any>(null);

  readonly tasks = this._tasks.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  readonly completedTasks = computed(() =>
    this._tasks().filter(t => t.completed)
  );

  loadTasks() {
    this._loading.set(true);
    this.api.getAll().subscribe({
      next: (tasks) => this._tasks.set(tasks),
      error: (err) => this._error.set(err),
      complete: () => this._loading.set(false),
    });
  }

  addTask(task: Task) {
    this._tasks.update(tasks => [...tasks, task]);
  }

  updateTask(task: Task) {
    this._tasks.update(tasks =>
      tasks.map(t => t.id === task.id ? task : t)
    );
  }

  deleteTask(id: string) {
    this._tasks.update(tasks => tasks.filter(t => t.id !== id));
  }
}
```

### 6. Componente `TaskList`
```ts
// src/app/tasks/pages/task-list/task-list.component.ts
import { Component, inject } from '@angular/core';
import { TasksStore } from '../../state/tasks.store';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
})
export class TaskListComponent {
  store = inject(TasksStore);

  tasks = this.store.tasks;
  loading = this.store.loading;

  ngOnInit() {
    this.store.loadTasks();
  }

  toggle(task: any) {
    this.store.updateTask({ ...task, completed: !task.completed });
  }

  remove(id: string) {
    this.store.deleteTask(id);
  }
}
```

### 7. Template `TaskList`
```html
<!-- src/app/tasks/pages/task-list/task-list.component.html -->
<div *ngIf="loading()">Loading...</div>
<ul>
  <li *ngFor="let task of tasks()">
    <label>
      <input type="checkbox" [checked]="task.completed" (change)="toggle(task)" />
      {{ task.title }}
    </label>
    <button (click)="remove(task.id)">Delete</button>
  </li>
</ul>
```

### 8. Service de API (mock)
```ts
// src/app/tasks/services/tasks-api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task } from '../models/task.model';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TasksApiService {
  getAll(): Observable<Task[]> {
    return of([
      { id: '1', title: 'Comprar pão', description: 'Padaria', completed: false },
      { id: '2', title: 'Estudar Signals', description: 'Angular 17+', completed: true },
    ]);
  }
}
```

### 9. Módulo principal de Tasks
```ts
// src/app/tasks/tasks.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskListComponent } from './pages/task-list/task-list.component';

@NgModule({
  declarations: [TaskListComponent],
  imports: [CommonModule],
})
export class TasksModule {}
```

---

Esse projeto é minimalista e usa apenas `Signals`, sem `actions`, `reducers` ou `effects`.

Se quiser, posso gerar também um `.zip` com esse projeto completo ou adicionar a feature de criação/edição de task. Deseja isso?
