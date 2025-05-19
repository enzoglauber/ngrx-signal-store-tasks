import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, effect, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { CreateTaskDto, UpdateTaskDto } from '@/app/models/task.model';
import { TaskStoreService } from '@/app/shared/stores/task/task.store';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss',
})
export class TaskFormComponent implements OnInit, OnDestroy {
  taskStore = inject(TaskStoreService);
  fb = inject(FormBuilder);
  route = inject(ActivatedRoute);
  router = inject(Router);

  taskForm: FormGroup;
  isEditMode = false;
  submitted = false;
  submitting = false;
  taskId: string | null = null;
  private taskSubscription?: Subscription;

  readonly patchFormEffect = effect(() => {
    if (!this.isEditMode) return;
    const task = this.taskStore.selectedTask();
    if (task) {
      this.taskForm.patchValue({
        title: task.title,
        description: task.description,
        completed: task.completed,
      });
    }
  });

  constructor() {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      completed: [false],
    });
  }

  get f() {
    return this.taskForm.controls;
  }

  ngOnInit(): void {
    this.taskId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.taskId;

    if (this.isEditMode && this.taskId) {
      this.taskStore.loadTask(this.taskId);
    }
  }

  ngOnDestroy(): void {
    // Clean up subscription to avoid memory leaks
    if (this.taskSubscription) {
      this.taskSubscription.unsubscribe();
    }
    this.taskStore.clearSelectedTask();
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.taskForm.invalid) {
      return;
    }

    this.submitting = true;

    if (this.isEditMode && this.taskId) {
      const changes: UpdateTaskDto = {
        title: this.taskForm.value.title,
        description: this.taskForm.value.description,
        completed: this.taskForm.value.completed,
      };

      this.taskStore.updateTask({ id: this.taskId, changes });
    } else {
      const newTask: CreateTaskDto = {
        title: this.taskForm.value.title,
        description: this.taskForm.value.description,
        completed: this.taskForm.value.completed,
      };

      this.taskStore.createTask(newTask);
    }

    // Redirecionar após a operação bem-sucedida
    setTimeout(() => {
      this.submitting = false;
      this.router.navigate(['/tasks']);
    }, 1000);
  }

  cancel(): void {
    this.router.navigate(['/tasks']);
  }
}
