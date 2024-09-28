import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TaskManagerService } from 'src/app/services/task-manager.service';
import { Task } from 'src/app/shared/interfaces/models/task';
import { TaskComponent } from './task/task.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormBuilder, FormsModule, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { TaskStatus } from 'src/app/shared/enums/task-status.enum';

@Component({
  selector: 'app-task-list-table',
  standalone: true,
  imports: [
    CommonModule,
    TaskComponent,
    MatButtonToggleModule,
    ReactiveFormsModule,
    FormsModule,    
  ],
  templateUrl: './task-list-table.component.html',
  styleUrls: ['./task-list-table.component.scss']
})
export class TaskListTableComponent implements OnInit {

  taskStatus = TaskStatus;
  filterForm: UntypedFormGroup = this.fb.group({});
  tasks = signal<Task[]>([]);
  private readonly _destroyRef = inject(DestroyRef);
  private _filterDirMap = new Map<number, number>()
  
  constructor(    
    private fb: FormBuilder,
    private taskManagerService: TaskManagerService
  ) {}
  
  ngOnInit(): void {
    this.filterForm = this.fb.group({
      filter: [-1]
    });

    const taskList = Array.from(this.taskManagerService.taskListMap.values());
    this.tasks.set([...taskList]);


    this.filterForm.get('filter')?.valueChanges
    .pipe(
      takeUntilDestroyed(this._destroyRef)
    ).subscribe(filter => {
      this._filterDirMap.clear();
      if (filter == -1) {
        this.tasks.set([...taskList]);
        return;
      }      
      this.tasks.set([...taskList.filter(x => x.status == filter)]);
    });          
  }

}
