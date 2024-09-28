import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Task } from 'src/app/shared/interfaces/models/task';
import { MatListModule } from '@angular/material/list';
import { ShowAssociatedPersonsComponent } from 'src/app/shared/components/show-associated-persons/show-associated-persons.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TaskManagerService } from 'src/app/services/task-manager.service';
import { TaskStatus } from 'src/app/shared/enums/task-status.enum';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { GenericDialogData } from 'src/app/shared/interfaces/generic-dialog-dialog';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatDividerModule,
    MatCheckboxModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    ShowAssociatedPersonsComponent,
    MatDialogModule,
    ConfirmationDialogComponent,
    ReactiveFormsModule,
    FormsModule,
    MatTooltipModule,
  ],
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {
  @Input() task!: Task;
  checkBoxControl = new FormControl();
  taskStatus = TaskStatus;  

  constructor(
    private taskManagerService: TaskManagerService,
    private router: Router,
    private toast: ToastrService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.checkBoxControl.setValue(this.task.status == TaskStatus.Complete);
  }

  /**
   * Evento cuando se cambia de estado
   */
  statusChange(isChecked: boolean): void {
    const confirmationToast = () => this.toast.success('Se ha actualizado el estado de la tarea correctamente.','Estado actualizado');
    let data: GenericDialogData;
    if (isChecked) {
      data = {
        title: 'Completar tarea',
        text: `¿Desea completar la tarea "${this.task.name}"?`
      };
      const dialogRef = this.dialog.open(ConfirmationDialogComponent,{
        data
      });

      dialogRef.afterClosed().subscribe((changeStatus) => {
        if (changeStatus) {
          this.task.status = TaskStatus.Complete;
          confirmationToast();
        }
        this.checkBoxControl.setValue(this.task.status == TaskStatus.Complete);
      });
      return;
    }
    data = {
      title: 'Colocar en pendiente',
      text: `¿Desea dejar en pendiente la tarea "${this.task.name}"?`
    };
    const dialogRef = this.dialog.open(ConfirmationDialogComponent,{
      data
    });

    dialogRef.afterClosed().subscribe((changeStatus) => {
      if (changeStatus) {          
        this.task.status = TaskStatus.Pending;
        confirmationToast();
      }
      this.checkBoxControl.setValue(this.task.status == TaskStatus.Complete);
    });
  }

  /**
   * Evento cuando se oprime editar
   */
  onEdit(): void {
    this.taskManagerService.currentTaskInfo = {
      isEdit: true,
      taskKey: this.task.key
    };
    this.router.navigate(['/create-task']);
  }
}
