import { Injectable } from '@angular/core';
import { TaskStatus } from '../shared/enums/task-status.enum';
import { Person } from '../shared/interfaces/models/person';
import { Task } from '../shared/interfaces/models/task';
import { TaskManager } from '../shared/interfaces/task-manager';

@Injectable({
  providedIn: 'root'
})
export class TaskManagerService {

  currentTaskInfo?: TaskManager;
  //Listado de tareas
  taskList: Task[] = [];
  taskListMap = new Map<string, Task>();
  //Listado de personas
  private _personList: Person[] = [];

  constructor() {

    this._personList = [
      {
        name: 'Persona 1',
        age: 21,
        skills: ['Angular']
      },
      {
        name: 'Persona 2',
        age: 22,
        skills: ['Angular', 'C#']
      },
      {
        name: 'Persona 3',
        age: 23,
        skills: ['Angular', 'C#', 'PHP', 'Salesforce', 'Visual', 'Entity Framework']
      },
      {
        name: 'Persona 4',
        age: 24,
        skills: ['Angular', 'C#', 'PHP', 'Salesforce']
      },
    ]

    this.taskList = [
      {
        key: "1",
        name: 'Task 1',
        limitDate: new Date(),
        associatedPersons: [this._personList[0], this._personList[1], this._personList[2], this._personList[3]],
        status: TaskStatus.Complete,
      },
      {
        key: "2",
        name: 'Task 2',
        limitDate: new Date(),
        associatedPersons: [this._personList[0], this._personList[1]],
        status: TaskStatus.Pending,
      },
      {
        key: "3",
        name: 'Task 3',
        limitDate: new Date(),
        associatedPersons: [this._personList[0], this._personList[1], this._personList[3]],
        status: TaskStatus.Complete,
      },
      {
        key: "4",
        name: 'Task 4',
        limitDate: new Date(),
        associatedPersons: [this._personList[0], this._personList[1], this._personList[2]],
        status: TaskStatus.Pending,
      },
      {
        key: "5",
        name: 'Task 5',
        limitDate: new Date(),
        associatedPersons: [this._personList[0], this._personList[1], this._personList[2], this._personList[3]],
        status: TaskStatus.Complete,
      },
      {
        key: "6",
        name: 'Task 6',
        limitDate: new Date(),
        associatedPersons: [this._personList[0], this._personList[1]],
        status: TaskStatus.Pending,
      },
      {
        key: "7",
        name: 'Task 7',
        limitDate: new Date(),
        associatedPersons: [this._personList[0], this._personList[1], this._personList[3]],
        status: TaskStatus.Complete,
      },
      {
        key: "8",
        name: 'Task 8',
        limitDate: new Date(),
        associatedPersons: [this._personList[0], this._personList[1], this._personList[2]],
        status: TaskStatus.Pending,
      },
      {
        key: "9",
        name: 'Task 9',
        limitDate: new Date(),
        associatedPersons: [this._personList[0], this._personList[1], this._personList[2]],
        status: TaskStatus.Pending,
      },
      {
        key: "10",
        name: 'Task 10',
        limitDate: new Date(),
        associatedPersons: [this._personList[0], this._personList[1], this._personList[2]],
        status: TaskStatus.Pending,
      },
    ];

    this.taskListMap = new Map(this.taskList.map(task => [task.key, task]));
  }
}
