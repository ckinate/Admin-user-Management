import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { AdminComponent } from './admin';
import { LoginComponent } from './login';
import { AuthGuard } from './_helper';
import { Role } from './_model';
import { ListComponent } from './users/list/list.component';
import { AddEditComponent } from './users/add-edit/add-edit.component';

const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'admin',
        component: AdminComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Admin] }
    },
    {
      path: 'users',
      component: ListComponent,
      canActivate: [AuthGuard],
      data: { roles: [Role.Admin] }
  },
  {
    path: 'add',
    component: AddEditComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin] }
  },
  {
    path: 'edit/:id',
    component: AddEditComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin] }
  },
    {
        path: 'login',
        component: LoginComponent
    },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
