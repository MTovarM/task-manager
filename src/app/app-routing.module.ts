import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'task-list', loadComponent: () => import('./views/task-manager/task-manager.component').then(x => x.TaskManagerComponent) },
  { path: 'create-task', loadComponent: () => import('./views/task-manager/create-task/create-task.component').then(x => x.CreateTaskComponent) },
  { path: 'manage-people', loadComponent: () => import('./views/manage-people/manage-people.component').then(x => x.ManagePeopleComponent) },
  { path: '', redirectTo: 'task-list', pathMatch: 'full' },
  { path: '**', redirectTo: 'task-list', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
