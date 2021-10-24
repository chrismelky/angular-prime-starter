/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';

import { CustomResponse } from '../../../utils/custom-response';
import { EnumService, PlanrepEnum } from 'src/app/shared/enum.service';
import { FinancialYear } from 'src/app/setup/financial-year/financial-year.model';
import { FinancialYearService } from 'src/app/setup/financial-year/financial-year.service';
import { BudgetClass } from 'src/app/setup/budget-class/budget-class.model';
import { BudgetClassService } from 'src/app/setup/budget-class/budget-class.service';
import { ActivityType } from 'src/app/setup/activity-type/activity-type.model';
import { ActivityTypeService } from 'src/app/setup/activity-type/activity-type.service';
import { AdminHierarchy } from 'src/app/setup/admin-hierarchy/admin-hierarchy.model';
import { AdminHierarchyService } from 'src/app/setup/admin-hierarchy/admin-hierarchy.service';
import { Section } from 'src/app/setup/section/section.model';
import { SectionService } from 'src/app/setup/section/section.service';
import { Facility } from 'src/app/setup/facility/facility.model';
import { FacilityService } from 'src/app/setup/facility/facility.service';
import { ActivityTaskNature } from 'src/app/setup/activity-task-nature/activity-task-nature.model';
import { ActivityTaskNatureService } from 'src/app/setup/activity-task-nature/activity-task-nature.service';
import { Project } from 'src/app/setup/project/project.model';
import { ProjectService } from 'src/app/setup/project/project.service';
import { Activity } from '../activity.model';
import { ActivityService } from '../activity.service';
import { ToastService } from 'src/app/shared/toast.service';
import { ResponsiblePersonService } from '../../responsible-person/responsible-person.service';
import { ResponsiblePerson } from '../../responsible-person/responsible-person.model';
import { AdminHierarchyCostCentre } from '../../admin-hierarchy-cost-centres/admin-hierarchy-cost-centre.model';
import { FundSourceService } from 'src/app/setup/fund-source/fund-source.service';
import { FundSource } from 'src/app/setup/fund-source/fund-source.model';
import { ProjectOutputService } from 'src/app/setup/project-output/project-output.service';
import { ProjectOutput } from 'src/app/setup/project-output/project-output.model';
import { ReferenceTypeService } from 'src/app/setup/reference-type/reference-type.service';
import { ReferenceType } from 'src/app/setup/reference-type/reference-type.model';
import { NationalReference } from 'src/app/setup/national-reference/national-reference.model';
import { PriorityAreaService } from 'src/app/setup/priority-area/priority-area.service';
import { PriorityArea } from 'src/app/setup/priority-area/priority-area.model';
import { Intervention } from 'src/app/setup/intervention/intervention.model';
import { SectorProblem } from '../../sector-problem/sector-problem.model';
import { ConfirmationService } from 'primeng/api';
import { ProjectType } from 'src/app/setup/project-type/project-type.model';
import { ExpenditureCategory } from 'src/app/setup/expenditure-category/expenditure-category.model';
import { ExpenditureCategoryService } from 'src/app/setup/expenditure-category/expenditure-category.service';
import { ResponsiblePersonUpdateComponent } from '../../responsible-person/update/responsible-person-update.component';

@Component({
  selector: 'app-activity-update',
  templateUrl: './activity-update.component.html',
})
export class ActivityUpdateComponent implements OnInit {
  isSaving = false;
  fundSourceIsLoading = false;
  taskNatureIsLoading = false;
  projectIsLoading = false;
  projectOutputIsLoading = false;
  facilityIsLoading = false;
  budgetClassIsLoading = false;
  referenceIsLoading = false;
  responsibleIsLoading = false;
  categoryIsLoading = false;

  formError = false;
  errors = [];

  financialYears?: FinancialYear[] = [];
  activityTypes?: ActivityType[] = [];
  adminHierarchies?: AdminHierarchy[] = [];
  sections?: Section[] = [];
  facilities?: Facility[] = [];
  allFacilities?: Facility[] = [];
  fundSources?: FundSource[] = [];
  allFundSources?: FundSource[] = [];
  activityTaskNatures?: ActivityTaskNature[] = [];
  projects?: Project[] = [];
  interventions?: Intervention[] = [];
  sectorProblems?: SectorProblem[] = [];
  // genericActivities?: GenericActivity[] = [];
  responsiblePeople?: ResponsiblePerson[] = [];
  budgetTypes?: PlanrepEnum[] = [];
  periodTypes?: PlanrepEnum[] = [];
  budgetClassTree?: any[] = [];
  budgetClasses?: BudgetClass[] = [];
  mainBudgetClass?: BudgetClass;
  mainBudgetClasses?: BudgetClass[] = [];
  adminHierarchyCostCentre?: AdminHierarchyCostCentre;
  referenceLoading = false;
  referenceTypes?: ReferenceType[] = [];
  priorityAreas?: PriorityArea[] = [];
  projectTypes: ProjectType[] = [];
  expenditureCategories?: ExpenditureCategory[] = [];
  projectOutputs?: ProjectOutput[] = [];
  projectTypeRequired = false;

  /**
   * Declare form
   */
  generalForm = this.fb.group({
    id: [null, []],
    description: [null, [Validators.required]],
    code: [null, []],
    indicator: [null, [Validators.required]],
    indicator_value: [null, [Validators.required]],
    long_term_target_id: [null, [Validators.required]],
    financial_year_target_id: [null, [Validators.required]],
    financial_year_id: [null, [Validators.required]],
    budget_class_id: [null, [Validators.required]], //Budget class will be binded to tree node of Type @TreeNode
    main_budget_class_id: [null, [Validators.required]], //Budget class will be binded to tree node of Type @TreeNode
    activity_type_id: [null, [Validators.required]],
    admin_hierarchy_id: [null, [Validators.required]],
    section_id: [null, [Validators.required]],
    facility_id: [null, [Validators.required]],
    activity_task_nature_id: [null, [Validators.required]],
    budget_type: [null, [Validators.required]],
    project_id: [null, [Validators.required]],
    project_output_id: [null, []],
    project_type_id: [null, []],
    expenditure_category_id: [null, []],
    project_output_value: [null, []],
    generic_activity_id: [null, []],
    responsible_person_id: [null, [Validators.required]],
    period_type: [null, []],
    period_one: [null, []],
    period_two: [null, []],
    period_three: [null, []],
    period_four: [null, []],
    is_active: [null, []],
    fund_sources: [[], [Validators.required]],
  });

  referenceForm = this.fb.group({
    priority_area_id: [null, []],
    intervention_id: [null, []],
    sector_problem_id: [null, []],
    references: this.fb.array([]),
  });

  constructor(
    protected activityService: ActivityService,
    protected financialYearService: FinancialYearService,
    protected budgetClassService: BudgetClassService,
    protected activityTypeService: ActivityTypeService,
    protected adminHierarchyService: AdminHierarchyService,
    protected sectionService: SectionService,
    protected facilityService: FacilityService,
    protected activityTaskNatureService: ActivityTaskNatureService,
    protected projectService: ProjectService,
    protected fundSourceService: FundSourceService,
    protected priorityAreaService: PriorityAreaService,
    // protected genericActivityService: GenericActivityService,
    protected responsiblePersonService: ResponsiblePersonService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService,
    protected enumService: EnumService,
    protected referenceTypeService: ReferenceTypeService,
    protected projectOutputService: ProjectOutputService,
    protected expenditureCategoryService: ExpenditureCategoryService,
    protected dialogService: DialogService
  ) {}

  ngOnInit(): void {
    /** get perio type from enums */
    this.periodTypes = this.enumService.get('periodTypes');

    /** Get dialog data set from activity component */
    const dialogData = this.dialogConfig.data;

    /** set admin hierarchy cost centre */
    this.adminHierarchyCostCentre = dialogData.adminHierarchyCostCentre;

    /** get activity to edit or create  from dialog   */
    const activity: Activity = { ...dialogData.activity };

    this.allFacilities = [...dialogData.facilities];

    this.facilities = [...this.allFacilities];

    this.activityTypes = [...dialogData.activityTypes];

    this.projectTypes = [...dialogData.projectTypes];

    /** fetch activity task nature by selected activity_type_id if edit mode */
    if (activity.id) {
      this.loadFundSources(activity.budget_class_id!, false);
      this.loadActivityTaskNature(activity.activity_type_id!);
      this.loadProjectOutput(activity.project_id!);
      this.loadActivityFundSource(activity.financial_year_id!, activity.id);
      this.updateProjectTypeValidation(activity.project_id!);
      activity.project_type_id &&
        this.loadExpenditureCategory(activity.project_type_id);
      activity.expenditure_category_id &&
        this.loadProjectOutput(activity.expenditure_category_id);
    }

    /** fetch budget class tree ie parent array with children array**/
    this.loadMainBudgetClassesWithChildren(activity.budget_class?.parent_id);

    /** Load responsible person by admin hiearch and sector */
    this.loadResponsiblePeople();

    //Initialize form with data from dialog
    this.updateForm(activity);

    /** Load National references  */
    this.loadReferences(activity.id, activity.financial_year_id);

    this.loadPriorityAreas(
      dialogData.objectiveId,
      activity.admin_hierarchy_id!,
      activity.priority_area_id
    );
  }

  /** Load main budget classess with children budget classes */
  loadMainBudgetClassesWithChildren(selectedMainBudgetClassId?: number): void {
    this.budgetClassService.tree().subscribe((resp) => {
      this.mainBudgetClasses = resp.data;
      if (selectedMainBudgetClassId) {
        this.loadBudgetClasses(selectedMainBudgetClassId);
      }
    });
  }

  /** load budget classes from main budget clasess by finding one in main budget class and get children
   * note: Main Budget classed is loaded with children properties
   */
  loadBudgetClasses(mainBudgetClassId: number): void {
    this.budgetClasses = this.mainBudgetClasses?.find(
      (mbc) => mbc.id === mainBudgetClassId
    )?.children;
  }

  /** Load fund sources by budget classes */
  loadFundSources(budgetClassId: number, reset?: boolean): void {
    this.fundSourceIsLoading = true;
    this.fundSourceService.getByBudgetClass(budgetClassId).subscribe(
      (resp) => {
        this.allFundSources = resp.data;
        this.fundSources = [...this.allFundSources!];
        this.fundSourceIsLoading = false;
        reset && this.generalForm.get('fund_sources')?.reset([]);
      },
      (error) => (this.fundSourceIsLoading = false)
    );
    this.loadProjects(budgetClassId);
  }

  /**
   * Load priority areas by sector or objective with inteventions and sector problem filtered by admin hierarchy id
   *
   * @param objectiveId filter priority area mapped by objective
   * @param adminHierarchyId adminarea id to filter sector problem
   * @param selectedPriorityAreaId if activity has priority area id load interventions and problem by selected id
   */
  loadPriorityAreas(
    objectiveId: number,
    adminHierarchyId: number,
    selectedPriorityAreaId?: number
  ): void {
    /** get sector id from this activity cost centre */
    const sectorId = this.adminHierarchyCostCentre?.section?.sector_id;

    this.priorityAreaService
      .bySectorOrObjective(sectorId!, objectiveId, adminHierarchyId)
      .subscribe((resp) => {
        this.priorityAreas = resp.data;
        if (this.priorityAreas?.length) {
        }
        /** load intervention and sector problems from selected priority area */
        if (selectedPriorityAreaId) {
          this.loadInterventionAndSectorProblem(selectedPriorityAreaId);
        }
      });
  }

  /**
   * Load reference type filtered by this cost centre sectorId
   */
  loadReferences(activityId?: number, financialYearId?: number): void {
    const sectorId = this.adminHierarchyCostCentre?.section?.sector_id;
    if (!sectorId) {
      this.toastService.warn(
        'Could not load reference; Selected section has no sector mapped'
      );
      return;
    }
    this.referenceLoading = true;
    this.referenceTypeService
      .byLinkLevelWithReferences('Activity', sectorId!)
      .subscribe(
        (resp) => {
          this.referenceLoading = false;
          this.referenceTypes = resp.data;
          /** If activity has id load it selected reference first before prepare reference controlls else prepare controlls */
          if (activityId) {
            this.loadExistingReference(financialYearId!, activityId);
          } else {
            this.prepareReferenceControls([]);
          }
        },
        (error) => {
          this.referenceLoading = false;
        }
      );
  }

  loadExistingReference(financialYearId: number, activityId: number): void {
    this.activityService
      .activityReferences(financialYearId, activityId)
      .subscribe((resp) => {
        this.prepareReferenceControls(resp.data!);
      });
  }

  /**
   * Get reference form array control
   */
  get referenceControls(): FormArray {
    return this.referenceForm.controls['references'] as FormArray;
  }

  /**
   * Prepare reference type component by
   * for each reference type create form group with
   * 1. name control for display purpose
   * 2. value control for binding selected value
   * 3. options control for select component
   * 4. isMultiple control dispaly mult or single select
   * @param selectedReferences
   */
  prepareReferenceControls(selectedReferences: NationalReference[]): void {
    this.referenceLoading = false;
    const ref = this.referenceControls;
    this.referenceTypes?.forEach((type) => {
      const value = type.multi_select
        ? selectedReferences.filter((r) => r.reference_type_id === type.id)
        : selectedReferences.find((r) => r.reference_type_id === type.id);

      ref.push(
        this.fb.group({
          options: [type.references],
          isMultiple: [type.multi_select],
          name: [type.name],
          value: [value, [Validators.required]],
        })
      );
    });
  }

  /** Load activity facility if activity id exist */
  loadActivityFundSource(financialYearId: number, activityId: number): void {
    this.activityService
      .activityFundSources(financialYearId, activityId)
      .subscribe((resp) => {
        const f = resp.data?.map((af) => {
          return {
            id: af.fund_source_id,
          };
        });
        this.generalForm.patchValue({
          fund_sources: f,
        });
      });
  }

  /**
   * Load intevention and sector proble form priority area
   * note. Interventions and sector problem are children of priority area object which are eager loaded with priority area
   *
   * @param priorityAreaId selected prioruy area id
   */
  loadInterventionAndSectorProblem(priorityAreaId: number): void {
    const priorityArea = this.priorityAreas?.find(
      (pa) => pa.id === priorityAreaId
    );
    this.interventions = priorityArea?.interventions;
    this.sectorProblems = priorityArea?.sector_problems;
  }

  /**
   * Load activity task nature by activity type
   */
  loadActivityTaskNature(activityTypeId: number): void {
    this.taskNatureIsLoading = true;
    this.activityTaskNatureService
      .query({
        activity_type_id: activityTypeId,
        columns: ['id', 'name', 'code'],
      })
      .subscribe(
        (resp) => {
          this.activityTaskNatures = resp.data;
          this.taskNatureIsLoading = false;
        },
        (error) => (this.taskNatureIsLoading = false)
      );
  }

  /** Load projects */
  loadProjects(budgetClassId: number): void {
    this.projectIsLoading = false;
    this.projectService
      .byBudgetClassAndSection(
        budgetClassId,
        this.adminHierarchyCostCentre?.section_id!
      )
      .subscribe(
        (resp) => {
          this.projects = resp.data;
          this.projectIsLoading = false;
        },
        (error) => {
          this.projectIsLoading = false;
        }
      );
  }

  loadExpenditureCategory(projectTypeId: number): void {
    this.categoryIsLoading = true;
    this.expenditureCategoryService
      .query({
        project_type_id: projectTypeId,
      })
      .subscribe(
        (resp) => {
          this.expenditureCategories = resp.data;
          this.categoryIsLoading = false;
        },
        (error) => {
          this.categoryIsLoading = false;
        }
      );
  }

  /** Load project output by project*/
  loadProjectOutput(expenditureCategoryId: number): void {
    this.projectOutputIsLoading = true;
    this.projectOutputService
      .query({
        expenditure_category_id: expenditureCategoryId,
        sector_id: this.adminHierarchyCostCentre?.section?.sector_id,
      })
      .subscribe((resp) => {
        this.projectOutputs = resp.data;
        this.projectOutputIsLoading = false;
      });
  }

  updateProjectTypeValidation(projectId: number): void {
    const project = this.projects?.find((p) => p.id === projectId);
    if (project?.code === '0000') {
      this.projectTypeRequired = false;
      this.generalForm.patchValue({
        expenditure_category_id: null,
        project_type_id: null,
        project_output_id: null,
        project_output_value: null,
      });
      this.generalForm.get('expenditure_category_id')?.clearValidators();
      this.generalForm.get('project_type_id')?.clearValidators();
      this.generalForm.get('project_output_id')?.clearValidators();
      this.generalForm.get('project_output_value')?.clearValidators();
    } else {
      this.projectTypeRequired = true;
      this.generalForm
        .get('expenditure_category_id')
        ?.setValidators([Validators.required]);
      this.generalForm
        .get('project_type_id')
        ?.setValidators([Validators.required]);
      this.generalForm
        .get('project_output_id')
        ?.setValidators([Validators.required]);
      this.generalForm
        .get('project_output_value')
        ?.setValidators([Validators.required]);
    }
    this.generalForm.get('expenditure_category_id')?.updateValueAndValidity();
    this.generalForm.get('project_type_id')?.updateValueAndValidity();
    this.generalForm.get('project_output_id')?.updateValueAndValidity();
    this.generalForm.get('project_output_value')?.updateValueAndValidity();
  }

  /**
   * Load responsible people
   */
  loadResponsiblePeople(): void {
    if (!this.adminHierarchyCostCentre?.section) {
      return;
    }
    this.responsibleIsLoading = true;
    this.responsiblePersonService
      .query({
        admin_hierarchy_id: this.adminHierarchyCostCentre?.admin_hierarchy_id,
        sector_id: this.adminHierarchyCostCentre?.section?.sector_id,
      })
      .subscribe((resp) => {
        this.responsiblePeople = resp.data;
        this.responsibleIsLoading = false;
      });
  }

  /**
   * Creating or updating ResponsiblePerson
   * @param responsiblePerson ; If undefined initize new model to create else edit existing model
   */
  createResponsiblePerson(): void {
    const data: ResponsiblePerson = {
      ...new ResponsiblePerson(),
      admin_hierarchy_id: this.adminHierarchyCostCentre?.admin_hierarchy_id,
      sector_id: this.adminHierarchyCostCentre?.section?.sector_id,
      is_active: true,
    };
    const ref = this.dialogService.open(ResponsiblePersonUpdateComponent, {
      data,
      header: 'Create ResponsiblePerson',
    });
    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadResponsiblePeople();
      }
    });
  }

  /**
   * When form is valid Create Activity or Update Facility type if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.generalForm.invalid || this.referenceForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const activity = this.createFromForm();
    if (activity.id !== undefined) {
      this.subscribeToSaveResponse(this.activityService.update(activity));
    } else {
      this.subscribeToSaveResponse(this.activityService.create(activity));
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<Activity>>
  ): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      (result) => this.onSaveSuccess(result),
      (error) => this.onSaveError(error)
    );
  }

  /**
   * When save successfully close dialog and display info message
   * @param result
   */
  protected onSaveSuccess(result: any): void {
    this.isSaving = false;
    this.toastService.info(result.message);
    this.dialogRef.close(true);
  }

  /**
   * Error handling specific to this component
   * Note; general error handling is done by ErrorInterceptor
   * @param error
   */
  protected onSaveError(error: any): void {
    this.isSaving = false;
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  /**
   * Set/Initialize form values
   * @param activity
   */
  protected updateForm(activity: Activity): void {
    this.generalForm.patchValue({
      id: activity.id,
      description: activity.description,
      code: activity.code,
      indicator: activity.indicator,
      indicator_value: activity.indicator_value,
      long_term_target_id: activity.long_term_target_id,
      financial_year_target_id: activity.financial_year_target_id,
      financial_year_id: activity.financial_year_id,
      facility_id: activity.facility_id,
      budget_class_id: activity.budget_class_id,
      main_budget_class_id: activity.budget_class?.parent_id,
      activity_type_id: activity.activity_type_id,
      admin_hierarchy_id: activity.admin_hierarchy_id,
      section_id: activity.section_id,
      activity_task_nature_id: activity.activity_task_nature_id,
      budget_type: activity.budget_type,
      project_id: activity.project_id,
      expenditure_category_id: activity.expenditure_category_id,
      project_type_id: activity.project_type_id,
      project_output_id: activity.project_output_id,
      project_output_value: activity.project_output_value,
      generic_activity_id: activity.generic_activity_id,
      responsible_person_id: activity.responsible_person_id,
      period_type: activity.period_type,
      period_one: activity.period_one,
      period_two: activity.period_two,
      period_three: activity.period_three,
      period_four: activity.period_four,
      is_active: activity.is_active,
      fund_sources: activity.fund_sources,
    });
    this.referenceForm.patchValue({
      priority_area_id: activity.priority_area_id,
      intervention_id: activity.intervention_id,
      sector_problem_id: activity.sector_problem_id,
    });
  }

  /**
   * Return form values as object of type Activity
   * @returns Activity
   */
  protected createFromForm(): Activity {
    return {
      ...new Activity(),
      id: this.generalForm.get(['id'])!.value,
      description: this.generalForm.get(['description'])!.value,
      code: this.generalForm.get(['code'])!.value,
      indicator: this.generalForm.get(['indicator'])!.value,
      indicator_value: this.generalForm.get(['indicator_value'])!.value,
      long_term_target_id: this.generalForm.get(['long_term_target_id'])!.value,
      financial_year_target_id: this.generalForm.get([
        'financial_year_target_id',
      ])!.value,
      financial_year_id: this.generalForm.get(['financial_year_id'])!.value,
      budget_class_id: this.generalForm.get(['budget_class_id'])!.value,
      activity_type_id: this.generalForm.get(['activity_type_id'])!.value,
      admin_hierarchy_id: this.generalForm.get(['admin_hierarchy_id'])!.value,
      section_id: this.generalForm.get(['section_id'])!.value,
      activity_task_nature_id: this.generalForm.get([
        'activity_task_nature_id',
      ])!.value,
      budget_type: this.generalForm.get(['budget_type'])!.value,
      project_id: this.generalForm.get(['project_id'])!.value,
      project_type_id: this.generalForm.get(['project_type_id'])!.value,
      expenditure_category_id: this.generalForm.get([
        'expenditure_category_id',
      ])!.value,
      facility_id: this.generalForm.get(['facility_id'])!.value,
      project_output_id: this.generalForm.get(['project_output_id'])!.value,
      project_output_value: this.generalForm.get(['project_output_value'])!
        .value,
      intervention_id: this.referenceForm.get(['intervention_id'])!.value,
      priority_area_id: this.referenceForm.get(['priority_area_id'])!.value,
      sector_problem_id: this.referenceForm.get(['sector_problem_id'])!.value,
      generic_activity_id: this.generalForm.get(['generic_activity_id'])!.value,
      responsible_person_id: this.generalForm.get(['responsible_person_id'])!
        .value,
      period_type: this.generalForm.get(['period_type'])!.value,
      period_one: this.generalForm.get(['period_one'])!.value,
      period_two: this.generalForm.get(['period_two'])!.value,
      period_three: this.generalForm.get(['period_three'])!.value,
      period_four: this.generalForm.get(['period_four'])!.value,
      is_active: this.generalForm.get(['is_active'])!.value,
      fund_sources: this.generalForm.get(['fund_sources'])!.value,
      references: this.referenceForm
        .get(['references'])!
        .value.map((ref: any) => {
          return ref.value;
        })
        .flat(),
    };
  }
}
