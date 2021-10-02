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
import { TreeNode } from 'primeng/api';
import { ResponsiblePersonService } from '../../responsible-person/responsible-person.service';
import { ResponsiblePerson } from '../../responsible-person/responsible-person.model';

@Component({
  selector: 'app-activity-update',
  templateUrl: './activity-update.component.html',
})
export class ActivityUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  financialYears?: FinancialYear[] = [];
  activityTypes?: ActivityType[] = [];
  adminHierarchies?: AdminHierarchy[] = [];
  sections?: Section[] = [];
  facilities?: Facility[] = [];
  activityTaskNatures?: ActivityTaskNature[] = [];
  projects?: Project[] = [];
  // interventions?: Intervention[] = [];
  // sectorProblems?: SectorProblem[] = [];
  // genericActivities?: GenericActivity[] = [];
  responsiblePeople?: ResponsiblePerson[] = [];
  budgetTypes?: PlanrepEnum[] = [];
  periodTypes?: PlanrepEnum[] = [];
  budgetClassTree?: any[] = [];
  budgetClasses?: BudgetClass[] = [];
  budgetClass?: TreeNode;

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    description: [null, [Validators.required]],
    code: [null, []],
    indicator: [null, []],
    indicator_value: [null, []],
    long_term_target_id: [null, [Validators.required]],
    financial_year_target_id: [null, [Validators.required]],
    financial_year_id: [null, [Validators.required]],
    budget_class_id: [null, [Validators.required]], //Budget class will be binded to tree node of Type @TreeNode
    activity_type_id: [null, [Validators.required]],
    admin_hierarchy_id: [null, [Validators.required]],
    section_id: [null, [Validators.required]],
    facility_id: [null, [Validators.required]],
    activity_task_nature_id: [null, [Validators.required]],
    budget_type: [null, [Validators.required]],
    project_id: [null, [Validators.required]],
    intervention_id: [null, []],
    sector_problem_id: [null, []],
    generic_activity_id: [null, []],
    responsible_person_id: [null, [Validators.required]],
    period_type: [null, [Validators.required]],
    period_one: [false, []],
    period_two: [false, []],
    period_three: [false, []],
    period_four: [false, []],
    is_active: [false, []],
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
    // protected interventionService: InterventionService,
    // protected sectorProblemService: SectorProblemService,
    // protected genericActivityService: GenericActivityService,
    protected responsiblePersonService: ResponsiblePersonService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService,
    protected enumService: EnumService
  ) {}

  ngOnInit(): void {
    /** fetch budget class tree ie parent array with children array**/
    this.budgetClassService.tree().subscribe((resp) => {
      this.budgetClasses = resp.data;
    });

    /** fetch activity types */
    this.activityTypeService
      .query({
        column: ['id', 'name', 'code'],
      })
      .subscribe((resp) => (this.activityTypes = resp.data));

    this.periodTypes = this.enumService.get('periodTypes');

    this.loadResponsiblePeople();
    this.loadProjects();

    const dialogData = this.dialogConfig.data;
    const activity: Activity = dialogData;
    /** fetch activity task nature by selected activity_type_id if edit mode */
    activity.id && this.loadActivityTaskNature(activity.activity_type_id!);

    //Initialize form with data from dialog
    this.updateForm(activity);
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
      .subscribe((resp) => (this.activityTaskNatures = resp.data));
  }

  /** Load projects */
  loadProjects(): void {
    this.projectService
      .query({
        columns: ['id', 'name', 'code'],
      })
      .subscribe((resp) => (this.projects = resp.data));
  }

  /**
   * Load responsible people
   */
  loadResponsiblePeople(): void {
    this.responsiblePersonService
      .query({
        //TODO filter by admin area and section
      })
      .subscribe((resp) => (this.responsiblePeople = resp.data));
  }

  /**
   * When form is valid Create Activity or Update Facility type if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
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
   * @param activity
   */
  protected updateForm(activity: Activity): void {
    this.editForm.patchValue({
      id: activity.id,
      description: activity.description,
      code: activity.code,
      indicator: activity.indicator,
      indicator_value: activity.indicator_value,
      long_term_target_id: activity.long_term_target_id,
      financial_year_target_id: activity.financial_year_target_id,
      financial_year_id: activity.financial_year_id,
      budget_class_id: activity.budget_class_id,
      activity_type_id: activity.activity_type_id,
      admin_hierarchy_id: activity.admin_hierarchy_id,
      section_id: activity.section_id,
      facility_id: activity.facility_id,
      activity_task_nature_id: activity.activity_task_nature_id,
      budget_type: activity.budget_type,
      project_id: activity.project_id,
      intervention_id: activity.intervention_id,
      sector_problem_id: activity.sector_problem_id,
      generic_activity_id: activity.generic_activity_id,
      responsible_person_id: activity.responsible_person_id,
      period_type: activity.period_type,
      period_one: activity.period_one,
      period_two: activity.period_two,
      period_three: activity.period_three,
      period_four: activity.period_four,
      is_active: activity.is_active,
    });
  }

  /**
   * Return form values as object of type Activity
   * @returns Activity
   */
  protected createFromForm(): Activity {
    return {
      ...new Activity(),
      id: this.editForm.get(['id'])!.value,
      description: this.editForm.get(['description'])!.value,
      code: this.editForm.get(['code'])!.value,
      indicator: this.editForm.get(['indicator'])!.value,
      indicator_value: this.editForm.get(['indicator_value'])!.value,
      long_term_target_id: this.editForm.get(['long_term_target_id'])!.value,
      financial_year_target_id: this.editForm.get(['financial_year_target_id'])!
        .value,
      financial_year_id: this.editForm.get(['financial_year_id'])!.value,
      budget_class_id: this.editForm.get(['budget_class_id'])!.value,
      activity_type_id: this.editForm.get(['activity_type_id'])!.value,
      admin_hierarchy_id: this.editForm.get(['admin_hierarchy_id'])!.value,
      section_id: this.editForm.get(['section_id'])!.value,
      facility_id: this.editForm.get(['facility_id'])!.value,
      activity_task_nature_id: this.editForm.get(['activity_task_nature_id'])!
        .value,
      budget_type: this.editForm.get(['budget_type'])!.value,
      project_id: this.editForm.get(['project_id'])!.value,
      intervention_id: this.editForm.get(['intervention_id'])!.value,
      sector_problem_id: this.editForm.get(['sector_problem_id'])!.value,
      generic_activity_id: this.editForm.get(['generic_activity_id'])!.value,
      responsible_person_id: this.editForm.get(['responsible_person_id'])!
        .value,
      period_type: this.editForm.get(['period_type'])!.value,
      period_one: this.editForm.get(['period_one'])!.value,
      period_two: this.editForm.get(['period_two'])!.value,
      period_three: this.editForm.get(['period_three'])!.value,
      period_four: this.editForm.get(['period_four'])!.value,
      is_active: this.editForm.get(['is_active'])!.value,
    };
  }
}
