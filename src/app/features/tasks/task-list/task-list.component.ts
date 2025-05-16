import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TaskStoreService } from '../../../stores/task/task.store';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent implements OnInit {
  taskStore = inject(TaskStoreService);
  router = inject(Router);

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskStore.loadTasks();
  }

  createNewTask(): void {
    this.router.navigate(['/tasks/new']);
  }

  viewTask(id: string): void {
    this.router.navigate(['/tasks', id]);
  }

  editTask(id: string): void {
    this.router.navigate(['/tasks', id, 'edit']);
  }

  deleteTask(id: string): void {
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
      this.taskStore.deleteTask(id);
    }
  }
}
