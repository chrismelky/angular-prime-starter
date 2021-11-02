/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
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
import { ProjectType } from 'src/app/setup/project-type/project-type.model';
import { ExpenditureCategory } from 'src/app/setup/expenditure-category/expenditure-category.model';
import { ExpenditureCategoryService } from 'src/app/setup/expenditure-category/expenditure-category.service';
import { ResponsiblePersonUpdateComponent } from '../../responsible-person/update/responsible-person-update.component';
import { OverlayPanel } from 'primeng/overlaypanel';
import { GenericActivity } from 'src/app/setup/generic-activity/generic-activity.model';
import { GenericActivityService } from 'src/app/setup/generic-activity/generic-activity.service';

@Component({
  selector: 'app-activity-update',
  templateUrl: './activity-update.component.html',
})
export class ActivityUpdateComponent implements OnInit {
  @ViewChild('genericActivityPanel') genericTargetPanel!: OverlayPanel;

  budgetIsLocked? = false;

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
  responsiblePeople?: ResponsiblePerson[] = [];
  budgetTypes?: PlanrepEnum[] = [];
  periodTypes?: PlanrepEnum[] = [];
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
  genericActivity?: GenericActivity;
  genericActivities?: GenericActivity[] = [];
  paramValues: any = {};
  params: any[] = [];
  paramsError = false;
  objectiveId?: number;

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
    protected genericActivityService: GenericActivityService,
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

    this.objectiveId = dialogData.objectiveId;

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
    this.loadReferenceTypes(
      activity.long_term_target_id!,
      activity.financial_year_id!,
      activity.id
    );

    this.loadPriorityAreas(
      dialogData.objectiveId,
      activity.admin_hierarchy_id!,
      activity.priority_area_id
    );

    /** If target has generic target load generic activities */
    dialogData.genericTargetId &&
      this.loadGenericActivities(
        dialogData.genericTargetId,
        this.adminHierarchyCostCentre?.admin_hierarchy
          ?.admin_hierarchy_position!,
        this.adminHierarchyCostCentre?.section_id!
      );

    this.budgetIsLocked = dialogData?.budgetIsLocked;

    if (this.budgetIsLocked) {
      this.generalForm.disable();
      this.referenceForm.disable();
    }
  }

  loadGenericActivities(
    genericTargetId: number,
    position: number,
    costCentreId: number
  ): void {
    this.genericActivityService
      .byTargetAndAdminLevelAndCostCentre(
        genericTargetId,
        position,
        costCentreId
      )
      .subscribe((resp) => {
        this.genericActivities = resp.data;
      });
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

  /** Load fund sources by budget classes reset fund source selection if budget class changed */
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

        /** load intervention and sector problems from selected priority area */
        if (selectedPriorityAreaId) {
          this.loadInterventionAndSectorProblem(selectedPriorityAreaId);
        }
      });
  }

  prepareParams(): void {
    if (this.genericActivity && this.genericActivity.params) {
      this.params = this.genericActivity.params.split(',');
    }
  }

  /**
   * Load reference type filtered by this cost centre sectorId and target
   */
  loadReferenceTypes(
    targetId: number,
    financialYearId: number,
    activityId?: number
  ): void {
    const sectorId = this.adminHierarchyCostCentre?.section?.sector_id;
    if (!sectorId) {
      this.toastService.warn(
        'Could not load reference; Selected section has no sector mapped'
      );
      return;
    }
    this.referenceLoading = true;
    this.referenceTypeService
      .byLinkLevelWithReferences('Activity', sectorId!, { targetId })
      .subscribe(
        (resp) => {
          this.referenceLoading = false;
          this.referenceTypes = resp.data;
          /** If activity has id load it selected reference first before prepare reference controlls else prepare controlls */
          if (activityId) {
            this.loadActivitySelectedReference(financialYearId!, activityId);
          } else {
            this.prepareReferenceControls([]);
          }
        },
        (error) => {
          this.referenceLoading = false;
        }
      );
  }

  loadActivitySelectedReference(
    financialYearId: number,
    activityId: number
  ): void {
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
          value: [
            { value, disabled: this.budgetIsLocked },
            [Validators.required],
          ],
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
      .byBudgetClassAndSection(budgetClassId, {
        sectionIds: [this.adminHierarchyCostCentre?.section_id!],
      })
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
      ...this.generalForm.value,
      ...this.referenceForm.value,
      references: this.referenceForm
        .get(['references'])!
        .value.map((ref: any) => {
          return ref.value;
        })
        .flat(),
    };
  }

  /**
   * Fill activity fields from generic activity
   *
   */
  createFromGeneric(): void {
    // Validate params
    this.paramsError = false;
    if (!this.genericActivity) {
      this.paramsError = true;
    }
    this.params.forEach((p) => {
      if (!this.paramValues[p]) {
        this.paramsError = true;
      }
    });
    if (this.paramsError) {
      return;
    }

    let description = this.genericActivity?.description;
    this.params.forEach((p) => {
      description = description?.replace(p, this.paramValues[p]);
    });

    /** If generic activity has priority area, load/set intervetion and sector proble from priorities
     * which where loaded on initilization */
    if (this.genericActivity?.priority_area_id) {
      this.loadInterventionAndSectorProblem(
        this.genericActivity.priority_area_id
      );
    }
    /**
     * If generic activity has budget class set subbudget class from main budgte class loaded at init
     */
    if (this.genericActivity?.budget_class_id) {
      this.loadBudgetClasses(this.genericActivity.budget_class?.parent_id!);
      this.loadFundSources(this.genericActivity.budget_class_id);
    }

    if (this.genericActivity?.activity_type_id) {
      this.loadActivityTaskNature(this.genericActivity.activity_type_id);
    }

    if (this.genericActivity?.project_id) {
      this.updateProjectTypeValidation(this.genericActivity?.project_id);
    }

    /** Patch values */
    this.generalForm.patchValue({
      description,
      generic_activity_id: this.genericActivity?.id,
      main_budget_class_id: this.genericActivity?.budget_class?.parent_id,
      budget_class_id: this.genericActivity?.budget_class_id,
      project_output_id: this.genericActivity?.project_output_id,
      expenditure_category_id: this.genericActivity?.expenditure_category_id,
      project_type_id: this.genericActivity?.project_type_id,
      project_id: this.genericActivity?.project_id,
      activity_type_id: this.genericActivity?.activity_type_id,
      activity_task_nature_id: this.genericActivity?.activity_task_nature_id,
      indicator: this.genericActivity?.indicator,
      fund_sources: this.genericActivity?.fund_sources
        ? JSON.parse(this.genericActivity?.fund_sources)
        : [],
    });

    this.referenceForm.patchValue({
      priority_area_id: this.genericActivity?.priority_area_id,
      intervention_id: this.genericActivity?.intervention_id,
    });

    this.genericTargetPanel?.hide();
  }
}
