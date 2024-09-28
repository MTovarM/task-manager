import { Component, inject, Inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { TaskManagerService } from 'src/app/services/task-manager.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TaskManager } from 'src/app/shared/interfaces/task-manager';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ShowAssociatedPersonsComponent } from "../../../shared/components/show-associated-persons/show-associated-persons.component";
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Person } from 'src/app/shared/interfaces/models/person';
import { Task } from 'src/app/shared/interfaces/models/task';
import { EditPersonData } from 'src/app/shared/interfaces/person-edit';
import { GenericDialogData } from 'src/app/shared/interfaces/generic-dialog-dialog';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { TaskStatus } from 'src/app/shared/enums/task-status.enum';
import { MatTooltipModule } from '@angular/material/tooltip'

@Component({
  selector: 'app-create-task',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatAutocompleteModule,
    MatCardModule,
    MatDividerModule,
    MatDatepickerModule,
    ShowAssociatedPersonsComponent,
    MatChipsModule,
    MatDialogModule,
    ConfirmationDialogComponent,
    MatTooltipModule,
  ],
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.scss']
})
export class CreateTaskComponent implements OnInit {
  addOnBlur = true;
  skillControl = new FormControl('', [Validators.required]);
  skills: string[] = [];
  announcer = inject(LiveAnnouncer);
  taskForm: UntypedFormGroup = this.fb.group({});
  personForm: UntypedFormGroup = this.fb.group({});
  skillsForm: UntypedFormGroup = this.fb.group({});
  taskData = signal<TaskManager | undefined>({ isEdit: false });
  taskToEdit?: Task; 
  persons: Person[] = [];
  editingPersonIndex = -1;

  constructor(
    private fb: FormBuilder,
    private taskManagerService: TaskManagerService,
    private router: Router,
    private toast: ToastrService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this._buildForms();
    if (this.taskManagerService.currentTaskInfo?.taskKey) {
      const currentTask = this.taskManagerService.taskListMap.get(this.taskManagerService.currentTaskInfo?.taskKey) as Task;
      this.taskForm.patchValue(currentTask);
      this.persons = currentTask.associatedPersons;
      this.taskToEdit = currentTask;
    }
  }

  set currentTask(taskManager: TaskManager | undefined) {
    this.taskManagerService.currentTaskInfo = taskManager;
  }

  /**
   * Evento cuando se edita persona
   * @param $event 
   */
  onEditPerson(personData: EditPersonData): void {
    this.personForm.patchValue(personData.person);
    this.skills = [...personData.person.skills];
    this.editingPersonIndex = personData.index;
  }

  /**
   * Evento cuando se añade persona
   */
  addPerson(): void {
    const { name, age } = this.personForm.value;
    
    // Validar si ya existe la persona
    if ((new Set<string>(this.persons.filter((x, index) => index != this.editingPersonIndex).map(x=> x.name.trim().toLowerCase()))).has(name.trim().toLowerCase())) {
      this.toast.warning('Ya existe una persona con el mismo nombre asignada a esta tarea.', 'Advertencia');
      return;
    }

    const person: Person = {
      name: name,
      age: age,
      skills: this.skills
    };

    if (this.editingPersonIndex >= 0) this.persons[this.editingPersonIndex] = person;
    else this.persons = [...this.persons, person];

    this.editingPersonIndex = -1;
    this.personForm.reset();
    this.skills = [];
  }

  /**
   * Evento cuando se elimina una persona
   */
  onDeletePerson(personIndex: number): void {
    let data: GenericDialogData = {
      title: 'Eliminar persona',
      text: `¿Desea eliminar a "${this.persons[personIndex].name}" de la tarea?`
    };

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data
    });

    dialogRef.afterClosed().subscribe((changeStatus) => {
      if (changeStatus) {
        this.toast.success('Se ha eliminado correctamente.', 'Persona eliminada');
        this.persons.splice(personIndex, 1);
      }
    });
  }

  /**
   * Evento cuando se cancela la edición o creación de tarea
   */
  onCancel(): void {
    this.currentTask = undefined;
    this.router.navigate(['/task-list']);
  }

  /**
   * Evento cuando se oprime guardar
   */
  onSave(): void {
    if (this.taskForm.invalid) {
      this.toast.warning('Complete los datos de la tarea.', 'Advertencia');
      return;
    }
    const { name, limitDate } = this.taskForm.value;

    const task: Task = {
      key: (new Date()).getTime().toString(),
      name,
      limitDate,
      status: TaskStatus.Pending,
      associatedPersons: this.persons
    };

    //Se se está editando
    if (this.taskToEdit) {
      task.status = this.taskToEdit.status;
      task.key = this.taskToEdit.key;
    }

    if (this.taskManagerService.currentTaskInfo?.taskKey) this.taskManagerService.taskListMap.set(this.taskManagerService.currentTaskInfo.taskKey, task);
    else {
      this.taskManagerService.taskListMap.set(task.key, task);
    }

    this.toast.success('Tarea guardada', 'Información');
    this.currentTask = undefined;
    this.router.navigate(['/task-list']);
  }

  /**
 * Evento cuando se añade una habilidad
 * @param event 
 */
  addSkill(): void {
    const value = this.skillControl.value as string;
    if (this.skills.findIndex(x => x.trim().toLowerCase() == value.trim().toLowerCase()) >= 0) {
      this.toast.warning('La habilidad ya existe', 'Advertencia');
      return;
    }
    this.skills.push(value);
    this.skillControl.reset();
  }

  /**
   * Evento cuando se elimina una habilidad
   * @param skill 
   */
  deleteSkill(skill: string): void {
    const index = this.skills.indexOf(skill);
    if (index >= 0) {
      this.skills.splice(index, 1);
      this.announcer.announce(`Removed ${skill}`);
    }
  }

  /**
   * Construir formularios
   */
  private _buildForms() {
    this.taskForm = this.fb.group({
      name: [, [Validators.required]],
      //#################### validator de limite de fecha menor
      limitDate: [, [Validators.required,]]
    });

    this.personForm = this.fb.group({
      name: [, [Validators.required, Validators.minLength(5)]],
      age: [, [Validators.required, Validators.min(18)]]
    });


  }

}
