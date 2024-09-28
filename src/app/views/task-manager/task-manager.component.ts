import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { TaskManagerService } from 'src/app/services/task-manager.service';
import { TaskManager } from 'src/app/shared/interfaces/task-manager';
import { CreateTaskComponent } from './create-task/create-task.component';
import { TaskListTableComponent } from './task-list-table/task-list-table.component';

@Component({
  selector: 'app-task-manager',
  standalone: true,
  imports: [
    CommonModule,
    TaskListTableComponent,
    CreateTaskComponent,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatDividerModule,
    RouterModule,
  ],
  templateUrl: './task-manager.component.html',
  styleUrls: ['./task-manager.component.scss'],
})
export class TaskManagerComponent {

  constructor(
    private router: Router,
    private taskManagerService: TaskManagerService, 
  ) {}

  /**
   * Evento cuando se oprime botón crear
   */
  onCreateButtonClick(): void {
    const data: TaskManager = {
      isEdit: false,
    };
    this.taskManagerService.currentTaskInfo = data;
    this.router.navigate(['/create-task']);
  }
}
