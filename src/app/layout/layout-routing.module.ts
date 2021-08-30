import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MainComponent } from "./main/main.component";
import { NotFoundComponent } from "./not-found/not-found.component";

const routes: Routes = [
  {
    path: "",
    component: MainComponent,
    children: [
      {
        path: "",
        redirectTo: "/dashboard",
        pathMatch: "full",
      },
      {
        path: "dashboard",
        loadChildren: () =>
          import("../dashboard/dashboard.module").then(
            (m) => m.DashboardModule
          ),
      },
      {
        path: "asset-use",
        loadChildren: () =>
          import("../setup/asset-use/asset-use.module").then(
            (m) => m.AssetUseModule
          ),
      },
      {
        path: "bank-account",
        loadChildren: () =>
          import("../setup/bank-account/bank-account.module").then(
            (m) => m.BankAccountModule
          ),
      },
      {
        path: "asset-condition",
        loadChildren: () =>
          import("../setup/asset-condition/asset-condition.module").then(
            (m) => m.AssetConditionModule
          ),
      },
      {
        path: "account-type",
        loadChildren: () =>
          import("../setup/account-type/account-type.module").then(
            (m) => m.AccountTypeModule
          ),
      },
      {
        path: "activity-type",
        loadChildren: () =>
          import("../setup/activity-type/activity-type.module").then(
            (m) => m.ActivityTypeModule
          ),
      },
      {
        path: "activity-task_nature",
        loadChildren: () =>
          import(
            "../setup/activity-task_nature/activity-task_nature.module"
          ).then((m) => m.ActivityTaskNatureModule),
      },
      {
        path: "admin-hierarchy_level",
        loadChildren: () =>
          import(
            "../setup/admin-hierarchy-level/admin-hierarchy-level.module"
          ).then((m) => m.AdminHierarchyLevelModule),
      },
      {
        path: "sector",
        loadChildren: () =>
          import("../setup/sector/sector.module").then((m) => m.SectorModule),
      },
      {
        path: "section-level",
        loadChildren: () =>
          import("../setup/section-level/section-level.module").then(
            (m) => m.SectionLevelModule
          ),
      },
      {
        path: "section",
        loadChildren: () =>
          import("../setup/section/section.module").then(
            (m) => m.SectionModule
          ),
      },
      {
        path: "reference-document-type",
        loadChildren: () =>
          import(
            "../setup/reference-document-type/reference-document-type.module"
          ).then((m) => m.ReferenceDocumentTypeModule),
      },
      {
        path: "decision-level",
        loadChildren: () =>
          import("../setup/decision-level/decision-level.module").then(
            (m) => m.DecisionLevelModule
          ),
      },
      {
        path: "reference-document_type",
        loadChildren: () =>
          import(
            "../setup/reference-document-type/reference-document-type.module"
          ).then((m) => m.ReferenceDocumentTypeModule),
      },
      {
        path: "reference-type",
        loadChildren: () =>
          import("../setup/reference-type/reference-type.module").then(
            (m) => m.ReferenceTypeModule
          ),
      },
      {
        path: "financial-year",
        loadChildren: () =>
          import("../setup/financial-year/financial-year.module").then(
            (m) => m.FinancialYearModule
          ),
      },
      {
        path: "reference-type",
        loadChildren: () =>
          import("../setup/reference-type/reference-type.module").then(
            (m) => m.ReferenceTypeModule
          ),
      },
      {
        path: "financial-year",
        loadChildren: () =>
          import("../setup/financial-year/financial-year.module").then(
            (m) => m.FinancialYearModule
          ),
      },
      {
        path: "admin-hierarchy-level",
        loadChildren: () =>
          import(
            "../setup/admin-hierarchy-level/admin-hierarchy-level.module"
          ).then((m) => m.AdminHierarchyLevelModule),
      },
      {
        path: "decision-level",
        loadChildren: () =>
          import("../setup/decision-level/decision-level.module").then(
            (m) => m.DecisionLevelModule
          ),
      },
      {
        path: "reference-document-type",
        loadChildren: () =>
          import(
            "../setup/reference-document-type/reference-document-type.module"
          ).then((m) => m.ReferenceDocumentTypeModule),
      },
      {
        path: "admin-hierarchy",
        loadChildren: () =>
          import("../setup/admin-hierarchy/admin-hierarchy.module").then(
            (m) => m.AdminHierarchyModule
          ),
      },
      {
        path: "strategic-plan",
        loadChildren: () =>
          import("../setup/strategic-plan/strategic-plan.module").then(
            (m) => m.StrategicPlanModule
          ),
      },
      {
        path: "activity-task-nature",
        loadChildren: () =>
          import(
            "../setup/activity-task-nature/activity-task-nature.module"
          ).then((m) => m.ActivityTaskNatureModule),
      },
      {
        path: "objective-type",
        loadChildren: () =>
          import("../setup/objective-type/objective-type.module").then(
            (m) => m.ObjectiveTypeModule
          ),
      },
      {
        path: "objective",
        loadChildren: () =>
          import("../setup/objective/objective.module").then(
            (m) => m.ObjectiveModule
          ),
      },
      {
        path: "long-term-target",
        loadChildren: () =>
          import("../setup/long-term-target/long-term-target.module").then(
            (m) => m.LongTermTargetModule
          ),
      },
      {
        path: "calendar-event",
        loadChildren: () =>
          import("../setup/calendar-event/calendar-event.module").then(
            (m) => m.CalendarEventModule
          ),
      },
      {
        path: "calendar",
        loadChildren: () =>
          import("../setup/calendar/calendar.module").then(
            (m) => m.CalendarModule
          ),
      },
      {
        path: "cas-assessment-round",
        loadChildren: () =>
          import(
            "../setup/cas-assessment-round/cas-assessment-round.module"
          ).then((m) => m.CasAssessmentRoundModule),
      },
      {
        path: "cas-plan",
        loadChildren: () =>
          import("../setup/cas-plan/cas-plan.module").then(
            (m) => m.CasPlanModule
          ),
      },
      {
        path: "cas-plan-content",
        loadChildren: () =>
          import("../setup/cas-plan-content/cas-plan-content.module").then(
            (m) => m.CasPlanContentModule
          ),
      },
      {
        path: "cas-assessment-state",
        loadChildren: () =>
          import(
            "../setup/cas-assessment-state/cas-assessment-state.module"
          ).then((m) => m.CasAssessmentStateModule),
      },
      {
        path: "cas-assessment-criteria",
        loadChildren: () =>
          import(
            "../setup/cas-assessment-criteria/cas-assessment-criteria.module"
          ).then((m) => m.CasAssessmentCriteriaModule),
      },
      {
        path: "cas-assessment-sub-criteria",
        loadChildren: () =>
          import(
            "../setup/cas-assessment-sub-criteria/cas-assessment-sub-criteria.module"
          ).then((m) => m.CasAssessmentSubCriteriaModule),
      },
      {
        path: "cas-assessment-sub-criteria-option",
        loadChildren: () =>
          import(
            "../setup/cas-assessment-sub-criteria-option/cas-assessment-sub-criteria-option.module"
          ).then((m) => m.CasAssessmentSubCriteriaOptionModule),
      },
      {
        path: "cas-assessment-category-version",
        loadChildren: () =>
          import(
            "../setup/cas-assessment-category-version/cas-assessment-category-version.module"
          ).then((m) => m.CasAssessmentCategoryVersionModule),
      },
      {
        path: "cas-assessment-criteria-option",
        loadChildren: () =>
          import(
            "../setup/cas-assessment-criteria-option/cas-assessment-criteria-option.module"
          ).then((m) => m.CasAssessmentCriteriaOptionModule),
      },
      {
        path: "cas-assessment-category",
        loadChildren: () =>
          import(
            "../setup/cas-assessment-category/cas-assessment-category.module"
          ).then((m) => m.CasAssessmentCategoryModule),
      },
      {
        path: "reference-document",
        loadChildren: () =>
          import("../setup/reference-document/reference-document.module").then(
            (m) => m.ReferenceDocumentModule
          ),
      },
      {
        path: "period-group",
        loadChildren: () =>
          import("../setup/period-group/period-group.module").then(
            (m) => m.PeriodGroupModule
          ),
      },
      {
        path: "data-set",
        loadChildren: () =>
          import("../setup/data-set/data-set.module").then(
            (m) => m.DataSetModule
          ),
      },
      {
        path: "option-set",
        loadChildren: () =>
          import("../setup/option-set/option-set.module").then(
            (m) => m.OptionSetModule
          ),
      },
      {
        path: "category-option",
        loadChildren: () =>
          import("../setup/category-option/category-option.module").then(
            (m) => m.CategoryOptionModule
          ),
      },
      {
        path: "category-combination",
        loadChildren: () =>
          import(
            "../setup/category-combination/category-combination.module"
          ).then((m) => m.CategoryCombinationModule),
      },
      {
        path: "category-category-option",
        loadChildren: () =>
          import(
            "../setup/category-category-option/category-category-option.module"
          ).then((m) => m.CategoryCategoryOptionModule),
      },
      {
        path: "category",
        loadChildren: () =>
          import("../setup/category/category.module").then(
            (m) => m.CategoryModule
          ),
      },
      {
        path: "calendar",
        loadChildren: () =>
          import("../setup/calendar/calendar.module").then(
            (m) => m.CalendarModule
          ),
      },
      {
        path: "category-category-combination",
        loadChildren: () =>
          import(
            "../setup/category-category-combination/category-category-combination.module"
          ).then((m) => m.CategoryCategoryCombinationModule),
      },
      {
        path: "data-element",
        loadChildren: () =>
          import("../setup/data-element/data-element.module").then(
            (m) => m.DataElementModule
          ),
      },
      {
        path: "facility-type",
        loadChildren: () =>
          import("../setup/facility-type/facility-type.module").then(
            (m) => m.FacilityTypeModule
          ),
      },
      {
        path: "facility",
        loadChildren: () =>
          import("../setup/facility/facility.module").then(
            (m) => m.FacilityModule
          ),
      },
      {
        path: "ceiling-chain",
        loadChildren: () =>
          import("../setup/ceiling-chain/ceiling-chain.module").then(
            (m) => m.CeilingChainModule
          ),
      },
      {
        path: "pe-form",
        loadChildren: () =>
          import("../setup/pe-form/pe-form.module").then((m) => m.PeFormModule),
      },
      {
        path: "pe-definition",
        loadChildren: () =>
          import("../setup/pe-definition/pe-definition.module").then(
            (m) => m.PeDefinitionModule
          ),
      },
      {
        path: "gfs-code-category",
        loadChildren: () =>
          import("../setup/gfs-code-category/gfs-code-category.module").then(
            (m) => m.GfsCodeCategoryModule
          ),
      },
      {
        path: "gfs-code",
        loadChildren: () =>
          import("../setup/gfs-code/gfs-code.module").then(
            (m) => m.GfsCodeModule
          ),
      },
      {
        path: "pe-sub-form",
        loadChildren: () =>
          import("../setup/pe-sub-form/pe-sub-form.module").then(
            (m) => m.PeSubFormModule
          ),
      },
      /**====Planrep router Generator Hook: Dont Delete====*/
      {
        path: "**",
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
