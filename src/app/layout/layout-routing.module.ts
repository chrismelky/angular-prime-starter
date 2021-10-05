import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MainComponent} from './main/main.component';
import {NotFoundComponent} from './not-found/not-found.component';
import {NgxPermissionsGuard} from 'ngx-permissions';
import {PermissionDeniedComponent} from './permission-denied/permission-denied.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
      {path: 'dashboard', loadChildren: () => import('../dashboard/dashboard.module').then((m) => m.DashboardModule)},
      {
        path: 'asset-use',
        loadChildren: () => import('../setup/asset-use/asset-use.module').then((m) => m.AssetUseModule),
        canLoad: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: 'WRITE_COMPREHENSIVE_PLAN_SETTING',
          },
        },
      },
      {
        path: 'bank-account',
        loadChildren: () =>
          import('../setup/bank-account/bank-account.module').then(
            (m) => m.BankAccountModule
          ),
        canLoad: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: 'WRITE_FINANCE_SETTING',
          },
        },
      },
      {
        path: 'asset-condition',
        loadChildren: () =>
          import('../setup/asset-condition/asset-condition.module').then(
            (m) => m.AssetConditionModule
          ),
        canLoad: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: 'WRITE_COMPREHENSIVE_PLAN_SETTING',
          },
        },
      },
      {
        path: 'account-type',
        loadChildren: () =>
          import('../setup/account-type/account-type.module').then(
            (m) => m.AccountTypeModule
          ),
        canLoad: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: 'WRITE_GFS_CODE_SETTING',
          },
        },
      },
      {
        path: 'activity-type',
        loadChildren: () =>
          import('../setup/activity-type/activity-type.module').then(
            (m) => m.ActivityTypeModule
          ),
        canLoad: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: 'WRITE_PLANNING_SETTING',
          },
        },
      },
      {
        path: 'sector',
        loadChildren: () =>
          import('../setup/sector/sector.module').then((m) => m.SectorModule),
        canLoad: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: 'READ_ADMIN_AREA_SETTING',
          },
        },
      },
      {
        path: 'section-level',
        loadChildren: () =>
          import('../setup/section-level/section-level.module').then(
            (m) => m.SectionLevelModule
          ),
        canLoad: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: 'READ_ADMIN_AREA_SETTING',
          },
        },
      },
      {
        path: 'section',
        loadChildren: () =>
          import('../setup/section/section.module').then(
            (m) => m.SectionModule
          ),
        canLoad: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: 'READ_ADMIN_AREA_SETTING',
          },
        },
      },
      {
        path: 'reference-document-type',
        loadChildren: () =>
          import(
            '../setup/reference-document-type/reference-document-type.module'
            ).then((m) => m.ReferenceDocumentTypeModule),
        canLoad: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: 'WRITE_PLANNING_SETTING',
          },
        },
      },
      {
        path: 'decision-level',
        loadChildren: () =>
          import('../setup/decision-level/decision-level.module').then(
            (m) => m.DecisionLevelModule
          ),
        canLoad: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: 'READ_ADMIN_AREA_SETTING',
          },
        },
      },
      {
        path: 'reference-type',
        loadChildren: () =>
          import('../setup/reference-type/reference-type.module').then(
            (m) => m.ReferenceTypeModule
          ),
        canLoad: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: 'WRITE_NATIONAL_REFERENCE',
          },
        },
      },
      {
        path: 'financial-year',
        loadChildren: () =>
          import('../setup/financial-year/financial-year.module').then(
            (m) => m.FinancialYearModule
          ),
        canLoad: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: 'WRITE_FINANCIAL_YEAR_SETTING',
          },
        },
      },
      {
        path: 'admin-hierarchy-level',
        loadChildren: () =>
          import(
            '../setup/admin-hierarchy-level/admin-hierarchy-level.module'
            ).then((m) => m.AdminHierarchyLevelModule),
        canLoad: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: 'READ_ADMIN_AREA_SETTING',
          },
        },
      },
      {
        path: 'decision-level',
        loadChildren: () =>
          import('../setup/decision-level/decision-level.module').then(
            (m) => m.DecisionLevelModule
          ),
      },
      {
        path: 'admin-hierarchy',
        loadChildren: () =>
          import('../setup/admin-hierarchy/admin-hierarchy.module').then(
            (m) => m.AdminHierarchyModule
          ),
        canLoad: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: 'READ_ADMIN_AREA_SETTING',
          },
        },
      },
      {
        path: 'strategic-plan',
        loadChildren: () =>
          import('../setup/strategic-plan/strategic-plan.module').then(
            (m) => m.StrategicPlanModule
          ),
        canLoad: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: 'WRITE_PLANNING_SETTING',
          },
        },
      },
      {
        path: 'activity-task-nature',
        loadChildren: () =>
          import(
            '../setup/activity-task-nature/activity-task-nature.module'
            ).then((m) => m.ActivityTaskNatureModule),
        canLoad: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: 'WRITE_PLANNING_SETTING',
          },
        },
      },
      {
        path: 'objective-type',
        loadChildren: () =>
          import('../setup/objective-type/objective-type.module').then(
            (m) => m.ObjectiveTypeModule
          ),
        canLoad: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: 'WRITE_PLANNING_SETTING',
          },
        },
      },
      {
        path: 'objective',
        loadChildren: () =>
          import('../setup/objective/objective.module').then(
            (m) => m.ObjectiveModule
          ),
        canLoad: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: 'WRITE_PLANNING_SETTING',
          },
        },
      },
      {
        path: 'long-term-target',
        loadChildren: () =>
          import('../planning/long-term-target/long-term-target.module').then(
            (m) => m.LongTermTargetModule
          ),
        canLoad: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: 'WRITE_PLANNING_SETTING',
          },
        },
      },
      {
        path: 'calendar-event',
        loadChildren: () =>
          import('../setup/calendar-event/calendar-event.module').then(
            (m) => m.CalendarEventModule
          ),
        canLoad: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: 'READ_ADMIN_AREA_SETTING',
          },
        },
      },
      {
        path: 'calendar',
        loadChildren: () =>
          import('../setup/calendar/calendar.module').then(
            (m) => m.CalendarModule
          ),
        canLoad: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: 'READ_ADMIN_AREA_SETTING',
          },
        },
      },
      {
        path: 'cas-assessment-round',
        loadChildren: () =>
          import(
            '../setup/cas-assessment-round/cas-assessment-round.module'
            ).then((m) => m.CasAssessmentRoundModule),
        canLoad: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: 'setup',
          },
        },
      },
      {
        path: 'cas-plan',
        loadChildren: () =>
          import('../setup/cas-plan/cas-plan.module').then(
            (m) => m.CasPlanModule
          ),
        canLoad: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: 'WRITE_COMPREHENSIVE_PLAN_SETTING',
          },
        },
      },
      {
        path: 'cas-plan-content',
        loadChildren: () =>
          import('../setup/cas-plan-content/cas-plan-content.module').then(
            (m) => m.CasPlanContentModule
          ),
        canLoad: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: 'WRITE_COMPREHENSIVE_PLAN_SETTING',
          },
        },
      },
      {
        path: 'cas-assessment-state',
        loadChildren: () =>
          import(
            '../setup/cas-assessment-state/cas-assessment-state.module'
            ).then((m) => m.CasAssessmentStateModule),
        canLoad: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: 'setup',
          },
        },
      },
      {
        path: 'cas-assessment-sub-criteria-option',
        loadChildren: () =>
          import(
            '../setup/cas-assessment-sub-criteria-option/cas-assessment-sub-criteria-option.module'
            ).then((m) => m.CasAssessmentSubCriteriaOptionModule),
        canLoad: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: 'setup',
          },
        },
      },
      {
        path: 'cas-assessment-category-version',
        loadChildren: () =>
          import(
            '../setup/cas-assessment-category-version/cas-assessment-category-version.module'
            ).then((m) => m.CasAssessmentCategoryVersionModule),
        canLoad: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: 'WRITE_ASSESSMENT_SETTINGS',
          },
        },
      },
      {
        path: 'cas-assessment-criteria-option',
        loadChildren: () =>
          import(
            '../setup/cas-assessment-criteria-option/cas-assessment-criteria-option.module'
            ).then((m) => m.CasAssessmentCriteriaOptionModule),
        canLoad: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: 'setup',
          },
        },
      },
      {
        path: 'cas-assessment-category',
        loadChildren: () =>
          import(
            '../setup/cas-assessment-category/cas-assessment-category.module'
            ).then((m) => m.CasAssessmentCategoryModule),
        canLoad: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: 'WRITE_ASSESSMENT_SETTINGS',
          },
        },
      },
      {
        path: 'reference-document',
        loadChildren: () =>
          import('../setup/reference-document/reference-document.module').then(
            (m) => m.ReferenceDocumentModule
          ),
        canLoad: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: 'WRITE_PLANNING_SETTING',
          },
        },
      },
      {
        path: 'period-group',
        loadChildren: () =>
          import('../setup/period-group/period-group.module').then(
            (m) => m.PeriodGroupModule
          ),
        canLoad: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: 'WRITE_FINANCIAL_YEAR_SETTING',
          },
        },
      },
      {
        path: 'data-set',
        loadChildren: () =>
          import('../setup/data-set/data-set.module').then(
            (m) => m.DataSetModule
          ),
        canLoad: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: 'WRITE_COMPREHENSIVE_PLAN_SETTING',
          },
        },
      },
      {
        path: 'option-set',
        loadChildren: () =>
          import('../setup/option-set/option-set.module').then(
            (m) => m.OptionSetModule
          ),
        canLoad: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: 'WRITE_COMPREHENSIVE_PLAN_SETTING',
          },
        },
      },
      {
        path: 'category-option',
        loadChildren: () =>
          import('../setup/category-option/category-option.module').then(
            (m) => m.CategoryOptionModule
          ),
        canLoad: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: 'WRITE_COMPREHENSIVE_PLAN_SETTING',
          },
        },
      },
      {
        path: 'category-combination',
        loadChildren: () =>
          import(
            '../setup/category-combination/category-combination.module'
            ).then((m) => m.CategoryCombinationModule),
        canLoad: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: 'WRITE_COMPREHENSIVE_PLAN_SETTING',
          },
        },
      },
      {
        path: 'category-category-option',
        loadChildren: () =>
          import(
            '../setup/category-category-option/category-category-option.module'
            ).then((m) => m.CategoryCategoryOptionModule),
        canLoad: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: 'WRITE_COMPREHENSIVE_PLAN_SETTING',
          },
        },
      },
      {
        path: 'category',
        loadChildren: () =>
          import('../setup/category/category.module').then(
            (m) => m.CategoryModule
          ),
        canLoad: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: 'WRITE_COMPREHENSIVE_PLAN_SETTING',
          },
        },
      },
      {
        path: 'category-category-combination',
        loadChildren: () =>
          import(
            '../setup/category-category-combination/category-category-combination.module'
            ).then((m) => m.CategoryCategoryCombinationModule),
        canLoad: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: 'WRITE_COMPREHENSIVE_PLAN_SETTING',
          },
        },
      },
      {
        path: 'data-element',
        loadChildren: () =>
          import('../setup/data-element/data-element.module').then(
            (m) => m.DataElementModule
          ),
        canLoad: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: 'WRITE_COMPREHENSIVE_PLAN_SETTING',
          },
        },
      },
      {
        path: 'facility-type',
        loadChildren: () =>
          import('../setup/facility-type/facility-type.module').then(
            (m) => m.FacilityTypeModule
          ),
        canLoad: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: 'WRITE_ADMIN_AREA_SETTING',
          },
        },
      },
      {
        path: 'facility',
        loadChildren: () =>
          import('../setup/facility/facility.module').then(
            (m) => m.FacilityModule
          ),
        canLoad: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: 'WRITE_ADMIN_AREA_SETTING',
          },
        },
      },
      {
        path: 'cas-assessment-category-version-state',
        loadChildren: () =>
          import(
            '../setup/cas-assessment-category-version-state/cas-assessment-category-version-state.module'
            ).then((m) => m.CasAssessmentCategoryVersionStateModule),
        canLoad: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: 'WRITE_ASSESSMENT_SETTINGS',
          },
        },
      },
      {
        path: 'user',
        loadChildren: () =>
          import('../setup/user/user.module').then((m) => m.UserModule),
        canLoad: [NgxPermissionsGuard],
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
        canLoad: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: 'WRITE_USER',
          },
        },
      },
      {
        path: 'baseline-statistic',
        loadChildren: () =>
          import('../setup/baseline-statistic/baseline-statistic.module').then(
            (m) => m.BaselineStatisticModule
          ),
        canLoad: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: 'WRITE_COMPREHENSIVE_PLAN_SETTING',
          },
        },
      },
      {
        path: 'baseline-statistic-value',
        loadChildren: () =>
          import(
            '../setup/baseline-statistic-value/baseline-statistic-value.module'
            ).then((m) => m.BaselineStatisticValueModule),
        canLoad: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: 'planning',
          },
        },
      },
      {
        path: 'advertisement',
        loadChildren: () =>
          import('../setup/advertisement/advertisement.module').then(
            (m) => m.AdvertisementModule
          ),
        canLoad: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: 'WRITE_ADVERTISEMENT',
          },
        },
      },
      {
        path: 'ceiling-chain',
        loadChildren: () =>
          import('../setup/ceiling-chain/ceiling-chain.module').then(
            (m) => m.CeilingChainModule
          ),
        canLoad: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: 'WRITE_BUDGETING_SETTING',
          },
        },
      },
      {
        path: 'fund-source-category',
        loadChildren: () =>
          import(
            '../setup/fund-source-category/fund-source-category.module'
            ).then((m) => m.FundSourceCategoryModule),
        canLoad: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: 'WRITE_FINANCE_SETTING',
          },
        },
      },
      {
        path: 'fund-type',
        loadChildren: () =>
          import('../setup/fund-type/fund-type.module').then(
            (m) => m.FundTypeModule
          ),
        canLoad: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: 'WRITE_FINANCE_SETTING',
          },
        },
      },
      {
        path: 'gfs-code-category',
        loadChildren: () =>
          import('../setup/gfs-code-category/gfs-code-category.module').then(
            (m) => m.GfsCodeCategoryModule
          ),
        canLoad: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: 'WRITE_GFS_CODE_SETTING',
          },
        },
      },
      {
        path: 'gfs-code',
        loadChildren: () =>
          import('../setup/gfs-code/gfs-code.module').then(
            (m) => m.GfsCodeModule
          ),
        canLoad: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: 'WRITE_GFS_CODE_SETTING',
          },
        },
      },
      {
        path: 'pe-form',
        loadChildren: () =>
          import('../setup/pe-form/pe-form.module').then((m) => m.PeFormModule),
        canLoad: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: 'WRITE_BUDGETING_SETTING',
          },
        },
      },
      {
        path: 'pe-definition',
        loadChildren: () =>
          import('../setup/pe-definition/pe-definition.module').then(
            (m) => m.PeDefinitionModule
          ),
        canLoad: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: 'WRITE_BUDGETING_SETTING',
          },
        },
      },
      {
        path: 'pe-sub-form',
        loadChildren: () =>
          import('../setup/pe-sub-form/pe-sub-form.module').then(
            (m) => m.PeSubFormModule
          ),
        canLoad: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: 'WRITE_BUDGETING_SETTING',
          },
        },
      },
      {
        path: 'cas-assessment-sub-criteria-possible-score',
        loadChildren: () =>
          import(
            '../setup/cas-assessment-sub-criteria-possible_score/cas-assessment-sub-criteria-possible_score.module'
            ).then((m) => m.CasAssessmentSubCriteriaPossibleScoreModule),
        canLoad: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: 'setup',
          },
        },
      },
      {
        path: 'cas-assessment-sub-criteria-report-set',
        loadChildren: () =>
          import(
            '../setup/cas-assessment-sub-criteria-report_set/cas-assessment-sub-criteria-report_set.module'
            ).then((m) => m.CasAssessmentSubCriteriaReportSetModule),
        canLoad: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: 'setup',
          },
        },
      },
      {
        path: 'pe-select-option',
        loadChildren: () =>
          import('../setup/pe-select-option/pe-select-option.module').then(
            (m) => m.PeSelectOptionModule
          ),
        canLoad: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: 'WRITE_BUDGETING_SETTING',
          },
        },
      },
      {
        path: 'role',
        loadChildren: () =>
          import('../setup/role/role.module').then((m) => m.RoleModule),
        canLoad: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: 'WRITE_ROLE',
          },
        },
      },
      {
        path: 'project',
        loadChildren: () =>
          import('../setup/project/project.module').then(
            (m) => m.ProjectModule
          ),
        canLoad: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: 'WRITE_FINANCE_SETTING',
          },
        },
      },
      {
        path: 'transport-category',
        loadChildren: () =>
          import('../setup/transport-category/transport-category.module').then(
            (m) => m.TransportCategoryModule
          ),
        canLoad: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: 'setup',
          },
        },
      },
      {
        path: 'budget-class',
        loadChildren: () =>
          import('../setup/budget-class/budget-class.module').then(
            (m) => m.BudgetClassModule
          ),
        canLoad: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: 'WRITE_FINANCE_SETTING',
          },
        },
      },
      {
        path: 'fund-source',
        loadChildren: () =>
          import('../setup/fund-source/fund-source.module').then(
            (m) => m.FundSourceModule
          ),
        canLoad: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: 'WRITE_FINANCE_SETTING',
          },
        },
      },
      {
        path: 'priority-area',
        loadChildren: () =>
          import('../setup/priority-area/priority-area.module').then(
            (m) => m.PriorityAreaModule
          ),
        canLoad: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: 'WRITE_PLANNING_SETTING',
          },
        },
      },
      {
        path: 'category-option-combination',
        loadChildren: () =>
          import(
            '../setup/category-option-combination/category-option-combination.module'
            ).then((m) => m.CategoryOptionCombinationModule),
        canLoad: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: 'setup',
          },
        },
      },
      {
        path: 'data-value',
        loadChildren: () =>
          import('../setup/data-value/data-value.module').then(
            (m) => m.DataValueModule
          ),
        canLoad: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: 'planning',
          },
        },
      },
      {
        path: 'national-reference',
        loadChildren: () =>
          import('../setup/national-reference/national-reference.module').then(
            (m) => m.NationalReferenceModule
          ),
        canLoad: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: 'WRITE_NATIONAL_REFERENCE',
          },
        },
      },
      {
        path: 'fund-source-budget-class',
        loadChildren: () =>
          import(
            '../setup/fund-source-budget-class/fund-source-budget-class.module'
            ).then((m) => m.FundSourceBudgetClassModule),
        canLoad: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: 'planning.ceiling',
          },
        },
      },
      {
        path: 'facility-custom-detail',
        loadChildren: () =>
          import(
            '../setup/facility-custom-detail/facility-custom-detail.module'
            ).then((m) => m.FacilityCustomDetailModule),
        canLoad: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: 'WRITE_ADMIN_AREA_SETTING',
          },
        },
      },
      {
        path: 'facility-custom-detail-mapping',
        loadChildren: () =>
          import(
            '../setup/facility-custom-detail-mapping/facility-custom-detail-mapping.module'
            ).then((m) => m.FacilityCustomDetailMappingModule),
        canLoad: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: 'WRITE_ADMIN_AREA_SETTING',
          },
        },
      },
      {
        path: 'pe-item',
        loadChildren: () =>
          import('../budgeting/pe-item/pe-item.module').then(
            (m) => m.PeItemModule
          ),
        canLoad: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: 'setup',
          },
        },
      },
      {
        path: 'period',
        loadChildren: () =>
          import('../setup/period/period.module').then((m) => m.PeriodModule),
        canLoad: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: 'WRITE_FINANCIAL_YEAR_SETTING',
          },
        },
      },
      {
        path: 'assessor-assignment',
        loadChildren: () =>
          import(
            '../setup/assessor-assignment/assessor-assignment.module'
            ).then((m) => m.AssessorAssignmentModule),
        canLoad: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: 'WRITE_ASSESSMENT_SCORE',
          },
        },
      },
      {
        path: 'admin-hierarchy-ceiling',
        loadChildren: () =>
          import(

            "../budgeting/admin-hierarchy-ceiling/admin-hierarchy-ceiling.module"
            ).then((m) => m.AdminHierarchyCeilingModule),
        canLoad: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: 'WRITE_CEILING_AMOUNT',
          },
        },
      },
      {
        path: 'assessment-home',
        loadChildren: () =>
          import('../setup/assessment-home/assessment-home.module').then(
            (m) => m.AssessmentHomeModule
          ),
        canLoad: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: 'WRITE_ASSESSMENT_SCORE',
          },
        },
      },
      {
        path: 'my-assessment',
        loadChildren: () =>
          import('../planning/my-assessment/my-assessment.module').then(
            (m) => m.MyAssessmentModule
          ),
        canLoad: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: 'assessment',
          },
        },
      },
      {
        path: 'received-assessment',
        loadChildren: () =>
          import(
            '../planning/received-assessment/received-assessment.module'
            ).then((m) => m.ReceivedAssessmentModule),
        canLoad: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: 'assessment',
          },
        },
      },
      {
        path: 'option-set-value',
        loadChildren: () =>
          import('../setup/option-set-value/option-set-value.module').then(
            (m) => m.OptionSetValueModule
          ),
        canLoad: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: 'setup',
          },
        },
      },
      {
        path: 'configuration-setting',
        loadChildren: () =>
          import(
            '../setup/configuration-setting/configuration-setting.module'
            ).then((m) => m.ConfigurationSettingModule),
        canLoad: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: 'WRITE_CONFIGURATION',
          },
        },
      },
      {
        path: 'performance-indicator',
        loadChildren: () =>
          import(
            '../setup/performance-indicator/performance-indicator.module'
            ).then((m) => m.PerformanceIndicatorModule),
        canLoad: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: 'WRITE_PLANNING_SETTING',
          },
        },
      },
      {
        path: 'assessment-criteria',
        loadChildren: () =>
          import(
            '../planning/assessment-criteria/assessment-criteria.module'
            ).then((m) => m.AssessmentCriteriaModule),
        canLoad: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: 'setup',
          },
        },
      },
      {
        path: 'permission',
        loadChildren: () =>
          import('../setup/permission/permission.module').then(
            (m) => m.PermissionModule
          ),
        canLoad: [NgxPermissionsGuard],
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
        canLoad: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: 'WRITE_USER',
          },
        },
      },
      {
        path: "scrutinization",
        loadChildren: () =>
          import("../planning/scrutinization/scrutinization.module").then(
            (m) => m.ScrutinizationModule
          ),
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
export class LayoutRoutingModule {
}
