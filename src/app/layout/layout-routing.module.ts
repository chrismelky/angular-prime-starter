import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { PermissionDeniedComponent } from './permission-denied/permission-denied.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('../dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
      },
      {
        path: 'user',
        loadChildren: () =>
          import('../setup/user/user.module').then((m) => m.UserModule),
        data: {
          permissions: {
            only: 'WRITE_USER',
          },
        },
      },
      {
        path: 'menu',
        loadChildren: () =>
          import('../setup/menu/menu.module').then((m) => m.MenuModule),
        data: {
          permissions: {
            only: 'WRITE_USER',
          },
        },
      },
      {
        path: 'role',
        loadChildren: () =>
          import('../setup/role/role.module').then((m) => m.RoleModule),
        data: {
          permissions: {
            only: 'WRITE_ROLE',
          },
        },
      },
      {
        path: 'group',
        loadChildren: () =>
          import('../setup/group/group.module').then((m) => m.GroupModule),
        data: {},
      },
      /**====Planrep router Generator Hook: Dont Delete====*/
      {
        path: '**',
        component: NotFoundComponent,
      },
      {
        path: 'permission-denied',
        component: PermissionDeniedComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {}
