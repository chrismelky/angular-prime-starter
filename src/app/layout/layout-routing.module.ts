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
        path: "cas-assessment-category-version-state",
        loadChildren: () =>
          import(
            "../setup/cas-assessment-category-version-state/cas-assessment-category-version-state.module"
          ).then((m) => m.CasAssessmentCategoryVersionStateModule),
      },
      {
        path: "user",
        loadChildren: () =>
          import("../setup/user/user.module").then((m) => m.UserModule),
      },
      {
        path: "baseline-statistic",
        loadChildren: () =>
          import("../setup/baseline-statistic/baseline-statistic.module").then(
            (m) => m.BaselineStatisticModule
          ),
      },
      {
        path: "baseline-statistic-value",
        loadChildren: () =>
          import(
            "../setup/baseline-statistic-value/baseline-statistic-value.module"
          ).then((m) => m.BaselineStatisticValueModule),
      },
      {
        path: "advertisement",
        loadChildren: () =>
          import("../setup/advertisement/advertisement.module").then(
            (m) => m.AdvertisementModule
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
        path: "fund-source-category",
        loadChildren: () =>
          import(
            "../setup/fund-source-category/fund-source-category.module"
          ).then((m) => m.FundSourceCategoryModule),
      },
      {
        path: "fund-type",
        loadChildren: () =>
          import("../setup/fund-type/fund-type.module").then(
            (m) => m.FundTypeModule
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
      {
        path: "cas-assessment-sub-criteria-possible_score",
        loadChildren: () =>
          import(
            "../setup/cas-assessment-sub-criteria-possible_score/cas-assessment-sub-criteria-possible_score.module"
          ).then((m) => m.CasAssessmentSubCriteriaPossibleScoreModule),
      },
      {
        path: "cas-assessment-sub-criteria-report_set",
        loadChildren: () =>
          import(
            "../setup/cas-assessment-sub-criteria-report_set/cas-assessment-sub-criteria-report_set.module"
          ).then((m) => m.CasAssessmentSubCriteriaReportSetModule),
      },
      {
        path: "pe-select-option",
        loadChildren: () =>
          import("../setup/pe-select-option/pe-select-option.module").then(
            (m) => m.PeSelectOptionModule
          ),
      },
      {
        path: "role",
        loadChildren: () =>
          import("../setup/role/role.module").then((m) => m.RoleModule),
      },
      {
        path: "project",
        loadChildren: () =>
          import("../setup/project/project.module").then(
            (m) => m.ProjectModule
          ),
      },
      {
        path: "transport-category",
        loadChildren: () =>
          import("../setup/transport-category/transport-category.module").then(
            (m) => m.TransportCategoryModule
          ),
      },
      {
        path: "budget-class",
        loadChildren: () =>
          import("../setup/budget-class/budget-class.module").then(
            (m) => m.BudgetClassModule
          ),
      },
      {
        path: "fund-source",
        loadChildren: () =>
          import("../setup/fund-source/fund-source.module").then(
            (m) => m.FundSourceModule
          ),
      },
      {
        path: "priority-area",
        loadChildren: () =>
          import("../setup/priority-area/priority-area.module").then(
            (m) => m.PriorityAreaModule
          ),
      },
      {
        path: "category-option-combination",
        loadChildren: () =>
          import(
            "../setup/category-option-combination/category-option-combination.module"
          ).then((m) => m.CategoryOptionCombinationModule),
      },
      {
        path: "data-value",
        loadChildren: () =>
          import("../setup/data-value/data-value.module").then(
            (m) => m.DataValueModule
          ),
      },
      {
        path: "national-reference",
        loadChildren: () =>
          import("../setup/national-reference/national-reference.module").then(
            (m) => m.NationalReferenceModule
          ),
      },
      {
        path: "fund-source-budget-class",
        loadChildren: () =>
          import(
            "../setup/fund-source-budget-class/fund-source-budget-class.module"
          ).then((m) => m.FundSourceBudgetClassModule),
      },
      {
        path: "facility-custom-detail",
        loadChildren: () =>
          import(
            "../setup/facility-custom-detail/facility-custom-detail.module"
          ).then((m) => m.FacilityCustomDetailModule),
      },
      {
        path: "facility-custom-detail-mapping",
        loadChildren: () =>
          import(
            "../setup/facility-custom-detail-mapping/facility-custom-detail-mapping.module"
          ).then((m) => m.FacilityCustomDetailMappingModule),
      },
      {
        path: "period",
      },
      {
        path: "pe-item",
        loadChildren: () =>
          import("../budgeting/pe-item/pe-item.module").then(
            (m) => m.PeItemModule
          ),
      },
      {
        path: "period",
        loadChildren: () =>
          import("../setup/period/period.module").then((m) => m.PeriodModule),
      },
      {
        path: "assessor-assignment",
        loadChildren: () =>
          import(
            "../setup/assessor-assignment/assessor-assignment.module"
          ).then((m) => m.AssessorAssignmentModule),
      },
      {
        path: "admin-hierarchy-ceiling",
        loadChildren: () =>
          import(
            "../setup/admin-hierarchy-ceiling/admin-hierarchy-ceiling.module"
          ).then((m) => m.AdminHierarchyCeilingModule),
      },
      {
        path: "assessment-home",
        loadChildren: () =>
          import("../setup/assessment-home/assessment-home.module").then(
            (m) => m.AssessmentHomeModule
          ),
      },
      {
        path: "my-assessment",
        loadChildren: () =>
          import("../planning/my-assessment/my-assessment.module").then(
            (m) => m.MyAssessmentModule
          ),
      },
      {
        path: "received-assessment",
        loadChildren: () =>
          import(
            "../planning/received-assessment/received-assessment.module"
          ).then((m) => m.ReceivedAssessmentModule),
      },
      {
        path: "option-set-value",
        loadChildren: () =>
          import("../setup/option-set-value/option-set-value.module").then(
            (m) => m.OptionSetValueModule
          ),
      },
      {
        path: "assessment-criteria",
        loadChildren: () =>
          import(
            "../planning/assessment-criteria/assessment-criteria.module"
            ).then((m) => m.AssessmentCriteriaModule),
      },
      { path: "permission",
        loadChildren: () =>
          import("../setup/permission/permission.module").then(
            (m) => m.PermissionModule
          ),
      },
      {
        path: "group",
        loadChildren: () =>
          import("../setup/group/group.module").then((m) => m.GroupModule),
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
