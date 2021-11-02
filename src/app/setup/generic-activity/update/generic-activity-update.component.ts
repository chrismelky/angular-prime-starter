/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { CustomResponse } from '../../../utils/custom-response';
import { PlanningMatrix } from 'src/app/setup/planning-matrix/planning-matrix.model';
import { PlanningMatrixService } from 'src/app/setup/planning-matrix/planning-matrix.service';
import { GenericTarget } from 'src/app/setup/generic-target/generic-target.model';
import { GenericTargetService } from 'src/app/setup/generic-target/generic-target.service';
import { PriorityArea } from 'src/app/setup/priority-area/priority-area.model';
import { PriorityAreaService } from 'src/app/setup/priority-area/priority-area.service';
import { Intervention } from 'src/app/setup/intervention/intervention.model';
import { InterventionService } from 'src/app/setup/intervention/intervention.service';
import { GenericSectorProblem } from 'src/app/setup/generic-sector-problem/generic-sector-problem.model';
import { GenericSectorProblemService } from 'src/app/setup/generic-sector-problem/generic-sector-problem.service';
import { GenericActivity } from '../generic-activity.model';
import { GenericActivityService } from '../generic-activity.service';
import { ToastService } from 'src/app/shared/toast.service';
import { SectionService } from '../../section/section.service';
import { Section } from '../../section/section.model';
import { AdminHierarchyLevel } from '../../admin-hierarchy-level/admin-hierarchy-level.model';
import { AdminHierarchyLevelService } from '../../admin-hierarchy-level/admin-hierarchy-level.service';
import { BudgetClassService } from '../../budget-class/budget-class.service';
import { BudgetClass } from '../../budget-class/budget-class.model';
import { FundSourceService } from '../../fund-source/fund-source.service';
import { ProjectService } from '../../project/project.service';
import { Project } from '../../project/project.model';
import { FundSource } from '../../fund-source/fund-source.model';
import { ActivityTaskNatureService } from '../../activity-task-nature/activity-task-nature.service';
import { ActivityTypeService } from '../../activity-type/activity-type.service';
import { ActivityType } from '../../activity-type/activity-type.model';
import { ActivityTaskNature } from '../../activity-task-nature/activity-task-nature.model';

@Component({
  selector: 'app-generic-activity-update',
  templateUrl: './generic-activity-update.component.html',
})
export class GenericActivityUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  planningMatrices?: PlanningMatrix[] = [];
  genericTargets?: GenericTarget[] = [];
  priorityAreas?: PriorityArea[] = [];
  interventions?: Intervention[] = [];
  genericSectorProblems?: GenericSectorProblem[] = [];
  sections?: Section[] = [];
  adminHierarchyLevels?: AdminHierarchyLevel[] = [];
  mainBudgetClass?: BudgetClass;
  mainBudgetClasses?: BudgetClass[] = [];
  budgetClasses?: BudgetClass[] = [];
  projects?: Project[] = [];
  fundSources?: FundSource[] = [];
  activityTypes?: ActivityType[] = [];
  activityTaskNatures?: ActivityTaskNature[] = [];
  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    description: [null, [Validators.required]],
    params: [null, [Validators.required]],
    planning_matrix_id: [null, [Validators.required]],
    generic_target_id: [
      { value: null, diasabled: true },
      [Validators.required],
    ],
    priority_area_id: [null, []],
    intervention_id: [null, []],
    generic_sector_problem_id: [null, []],
    main_budget_class_id: [null, []],
    budget_class_id: [null, []],
    activity_type_id: [null, []],
    activity_task_nature_id: [null, []],
    project_id: [null, []],
    project_type_id: [null, []],
    expenditure_category_id: [null, []],
    project_output_id: [null, []],
    indicator: [null, []],
    fund_sources: [[], []],
    is_active: [false, []],
    sections: [[], [Validators.required]],
    admin_hierarchy_levels: [[], [Validators.required]],
  });

  constructor(
    protected genericActivityService: GenericActivityService,
    protected planningMatrixService: PlanningMatrixService,
    protected genericTargetService: GenericTargetService,
    protected priorityAreaService: PriorityAreaService,
    protected interventionService: InterventionService,
    protected genericSectorProblemService: GenericSectorProblemService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService,
    protected sectionService: SectionService,
    protected budgetClassService: BudgetClassService,
    protected fundSourceService: FundSourceService,
    protected projectService: ProjectService,
    protected adminHierarchyLevelService: AdminHierarchyLevelService,
    protected activityTaskNatureService: ActivityTaskNatureService,
    protected activityTypeService: ActivityTypeService
  ) {}

  ngOnInit(): void {
    this.priorityAreaService
      .query({ columns: ['id', 'description'] })
      .subscribe(
        (resp: CustomResponse<PriorityArea[]>) =>
          (this.priorityAreas = resp.data)
      );
    this.adminHierarchyLevelService
      .query({
        columns: ['id', 'name', 'position'],
      })
      .subscribe((resp) => {
        this.adminHierarchyLevels = resp.data;
      });
    this.activityTypeService
      .query({
        columns: ['id', 'name'],
      })
      .subscribe((resp) => {
        this, (this.activityTypes = resp.data);
      });
    this.sectionService.costCentreSections().subscribe((resp) => {
      this.sections = resp.data;
    });

    const dialogData = this.dialogConfig.data;

    const genericActivity: GenericActivity = dialogData.genericActivity;

    this.updateForm(genericActivity); //Initialize form with data from dialog

    //if priority area exist load inrventions
    genericActivity.priority_area_id &&
      this.loadInterventions(genericActivity.priority_area_id);

    //load main budget class witb budget classes
    this.loadMainBudgetClassesWithChildren(
      genericActivity.budget_class?.parent_id
    );

    // If budget class is set load fund source
    genericActivity.budget_class_id &&
      this.loadFundSources(genericActivity.budget_class_id);

    /** If activity type is set load task natures by activity type */
    genericActivity.activity_type_id &&
      this.loadActivityTaskNature(genericActivity.activity_type_id);

    this.genericTargets = dialogData.genericTargets || [];
  }

  priorityChanged(priorityAreaId: number): void {
    this.loadInterventions(priorityAreaId);
    this.loadGenericSectorproblems(priorityAreaId);
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

  /** Load fund sources by budget classes */
  loadFundSources(budgetClassId: number): void {
    this.fundSourceService.getByBudgetClass(budgetClassId).subscribe(
      (resp) => {
        this.fundSources = resp.data;
      },
      (error) => {}
    );
    this.loadProjects(budgetClassId);
  }

  /** Load projects */
  loadProjects(budgetClassId: number): void {
    const Ids = (this.editForm.get('sections')?.value || []).map(
      (s: Section) => s.id
    );
    this.projectService
      .byBudgetClassAndSection(budgetClassId, { sectionIds: Ids })
      .subscribe((resp) => {
        this.projects = resp.data;
      });
  }

  /**
   * Load activity task nature by activity type
   */
  loadActivityTaskNature(activityTypeId: number): void {
    this.activityTaskNatureService
      .query({
        activity_type_id: activityTypeId,
        columns: ['id', 'name', 'code'],
      })
      .subscribe(
        (resp) => {
          this.activityTaskNatures = resp.data;
        },
        (error) => {}
      );
  }

  /** load budget classes from main budget clasess by finding one in main budget class and get children
   * note: Main Budget classed is loaded with children properties
   */
  loadBudgetClasses(mainBudgetClassId: number): void {
    this.budgetClasses = this.mainBudgetClasses?.find(
      (mbc) => mbc.id === mainBudgetClassId
    )?.children;
  }

  private loadInterventions(priorityAreaId: number): void {
    this.interventionService
      .query({
        priority_area_id: priorityAreaId,
        columns: ['id', 'description'],
      })
      .subscribe(
        (resp: CustomResponse<Intervention[]>) =>
          (this.interventions = resp.data)
      );
  }

  private loadGenericSectorproblems(priorityAreaId: number): void {
    this.genericSectorProblemService
      .query({
        priority_area_id: priorityAreaId,
        columns: ['id', 'description'],
      })
      .subscribe(
        (resp: CustomResponse<GenericSectorProblem[]>) =>
          (this.genericSectorProblems = resp.data)
      );
  }

  /**
   * When form is valid Create GenericActivity or Update Facility type if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const genericActivity = this.createFromForm();
    if (genericActivity.id !== undefined) {
      this.subscribeToSaveResponse(
        this.genericActivityService.update(genericActivity)
      );
    } else {
      this.subscribeToSaveResponse(
        this.genericActivityService.create(genericActivity)
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<GenericActivity>>
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
    this.toastService.info(result.message);
    this.dialogRef.close(true);
  }

  /**
   * Error handling specific to this component
   * Note; general error handling is done by ErrorInterceptor
   * @param error
   */
  protected onSaveError(error: any): void {}

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  /**
   * Set/Initialize form values
   * @param genericActivity
   */
  protected updateForm(genericActivity: GenericActivity): void {
    this.editForm.patchValue({
      id: genericActivity.id,
      description: genericActivity.description,
      params: genericActivity.params,
      planning_matrix_id: genericActivity.planning_matrix_id,
      generic_target_id: genericActivity.generic_target_id,
      priority_area_id: genericActivity.priority_area_id,
      intervention_id: genericActivity.intervention_id,
      generic_sector_problem_id: genericActivity.generic_sector_problem_id,
      is_active: genericActivity.is_active,
      sections: genericActivity.sections,
      admin_hierarchy_levels: genericActivity.admin_hierarchy_levels,
      main_budget_class_id: genericActivity.budget_class?.parent_id,
      budget_class_id: genericActivity.budget_class_id,
      activity_type_id: genericActivity.activity_type_id,
      activity_task_nature_id: genericActivity.activity_task_nature_id,
      project_id: genericActivity.project_id,
      project_output_id: genericActivity.project_output_id,
      expenditure_category_id: genericActivity.expenditure_category_id,
      project_type_id: genericActivity.project_type_id,
      indicator: genericActivity.indicator,
      fund_sources: genericActivity.fund_sources
        ? JSON.parse(genericActivity.fund_sources)
        : [],
    });
  }

  /**
   * Return form values as object of type GenericActivity
   * @returns GenericActivity
   */
  protected createFromForm(): GenericActivity {
    return {
      ...new GenericActivity(),
      ...this.editForm.value,
      fund_sources: JSON.stringify(this.editForm.get('fund_sources')?.value),
    };
  }
}
