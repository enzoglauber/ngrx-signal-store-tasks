import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { TaskStoreService } from '@/app/shared/stores/task/task.store';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './task-detail.component.html',
  styleUrl: './task-detail.component.scss',
})
export class TaskDetailComponent implements OnInit, OnDestroy {
  taskStore = inject(TaskStoreService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.taskStore.loadTask(id);
    }
  }

  ngOnDestroy(): void {
    this.taskStore.clearSelectedTask();
  }

  editTask(): void {
    const taskId = this.taskStore.selectedTask()?.id;
    if (taskId) {
      this.router.navigate(['/tasks', taskId, 'edit']);
    }
  }

  deleteTask(): void {
    const task = this.taskStore.selectedTask();
    if (
      task &&
      confirm(`Tem certeza que deseja excluir a tarefa "${task.title}"?`)
    ) {
      this.taskStore.deleteTask(task.id);
      this.router.navigate(['/tasks']);
    }
  }

  goBack(): void {
    this.router.navigate(['/tasks']);
  }
}
