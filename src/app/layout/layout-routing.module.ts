import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('../dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
      },
      {
        path: 'asset-use',
        loadChildren: () =>
          import('../setup/asset-use/asset-use.module').then(
            (m) => m.AssetUseModule
          ),
      },
      {
        path: 'bank-account',
        loadChildren: () =>
          import('../setup/bank-account/bank-account.module').then(
            (m) => m.BankAccountModule
          ),
      },
      {
        path: 'asset-condition',
        loadChildren: () =>
          import('../setup/asset-condition/asset-condition.module').then(
            (m) => m.AssetConditionModule
          ),
      },
      {
        path: 'account-type',
        loadChildren: () =>
          import('../setup/account-type/account-type.module').then(
            (m) => m.AccountTypeModule
          ),
      },
      {
        path: 'activity-type',
        loadChildren: () =>
          import('../setup/activity-type/activity-type.module').then(
            (m) => m.ActivityTypeModule
          ),
      },
      {
        path: 'activity-task_nature',
        loadChildren: () =>
          import(
            '../setup/activity-task_nature/activity-task_nature.module'
          ).then((m) => m.ActivityTaskNatureModule),
      },
      {
        path: 'admin-hierarchy_level',
        loadChildren: () =>
          import(
            '../setup/admin-hierarchy-level/admin-hierarchy-level.module'
          ).then((m) => m.AdminHierarchyLevelModule),
      },
      {
        path: 'sector',
        loadChildren: () =>
          import('../setup/sector/sector.module').then((m) => m.SectorModule),
      },
      {
        path: 'section-level',
        loadChildren: () =>
          import('../setup/section-level/section-level.module').then(
            (m) => m.SectionLevelModule
          ),
      },
      {
        path: 'section',
        loadChildren: () =>
          import('../setup/section/section.module').then(
            (m) => m.SectionModule
          ),
      },
      {
        path: 'reference-document-type',
        loadChildren: () =>
          import(
            '../setup/reference-document-type/reference-document-type.module'
          ).then((m) => m.ReferenceDocumentTypeModule),
      },
      {
        path: 'decision-level',
        loadChildren: () =>
          import('../setup/decision-level/decision-level.module').then(
            (m) => m.DecisionLevelModule
          ),
      },
      {
        path: 'reference-document_type',
        loadChildren: () =>
          import(
            '../setup/reference-document-type/reference-document-type.module'
          ).then((m) => m.ReferenceDocumentTypeModule),
      },
      {
        path: 'reference-type',
        loadChildren: () =>
          import('../setup/reference-type/reference-type.module').then(
            (m) => m.ReferenceTypeModule
          ),
      },
      {
        path: 'financial-year',
        loadChildren: () =>
          import('../setup/financial-year/financial-year.module').then(
            (m) => m.FinancialYearModule
          ),
      },
      {
        path: 'reference-type',
        loadChildren: () =>
          import('../setup/reference-type/reference-type.module').then(
            (m) => m.ReferenceTypeModule
          ),
      },
      {
        path: 'financial-year',
        loadChildren: () =>
          import('../setup/financial-year/financial-year.module').then(
            (m) => m.FinancialYearModule
          ),
      },
      {
        path: 'admin-hierarchy-level',
        loadChildren: () =>
          import(
            '../setup/admin-hierarchy-level/admin-hierarchy-level.module'
          ).then((m) => m.AdminHierarchyLevelModule),
      },
      {
        path: 'decision-level',
        loadChildren: () =>
          import('../setup/decision-level/decision-level.module').then(
            (m) => m.DecisionLevelModule
          ),
      },
      {
        path: 'reference-document-type',
        loadChildren: () =>
          import(
            '../setup/reference-document-type/reference-document-type.module'
          ).then((m) => m.ReferenceDocumentTypeModule),
      },
      {
        path: 'admin-hierarchy',
        loadChildren: () =>
          import('../setup/admin-hierarchy/admin-hierarchy.module').then(
            (m) => m.AdminHierarchyModule
          ),
      },
      {
        path: 'strategic-plan',
        loadChildren: () =>
          import('../setup/strategic-plan/strategic-plan.module').then(
            (m) => m.StrategicPlanModule
          ),
      },
      {
        path: 'activity-task-nature',
        loadChildren: () =>
          import(
            '../setup/activity-task-nature/activity-task-nature.module'
          ).then((m) => m.ActivityTaskNatureModule),
      },
      /**====Planrep router Generator Hook: Dont Delete====*/
      {
        path: '**',
        component: NotFoundComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {}
