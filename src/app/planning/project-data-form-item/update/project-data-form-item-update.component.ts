/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";

import { CustomResponse } from "../../../utils/custom-response";
import { AdminHierarchy } from "src/app/setup/admin-hierarchy/admin-hierarchy.model";
import { AdminHierarchyService } from "src/app/setup/admin-hierarchy/admin-hierarchy.service";
import { FinancialYear } from "src/app/setup/financial-year/financial-year.model";
import { FinancialYearService } from "src/app/setup/financial-year/financial-year.service";
import { ProjectDataFormQuestion } from "src/app/setup/project-data-form-question/project-data-form-question.model";
import { ProjectDataFormQuestionService } from "src/app/setup/project-data-form-question/project-data-form-question.service";
import { Section } from "src/app/setup/section/section.model";
import { SectionService } from "src/app/setup/section/section.service";
import { Project } from "src/app/setup/project/project.model";
import { ProjectService } from "src/app/setup/project/project.service";
import { ProjectDataForm } from "src/app/setup/project-data-form/project-data-form.model";
import { ProjectDataFormService } from "src/app/setup/project-data-form/project-data-form.service";
import { ProjectDataFormItem } from "../project-data-form-item.model";
import { ProjectDataFormItemService } from "../project-data-form-item.service";
import { ToastService } from "src/app/shared/toast.service";

@Component({
  selector: "app-project-data-form-item-update",
  templateUrl: "./project-data-form-item-update.component.html",
})
export class ProjectDataFormItemUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  adminHierarchies?: AdminHierarchy[] = [];
  financialYears?: FinancialYear[] = [];
  projectDataFormQuestions?: ProjectDataFormQuestion[] = [];
  sections?: Section[] = [];
  projects?: Project[] = [];
  projectDataForms?: ProjectDataForm[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    admin_hierarchy_id: [null, [Validators.required]],
    financial_year_id: [null, [Validators.required]],
    project_data_form_question_id: [null, [Validators.required]],
    section_id: [null, [Validators.required]],
    project_id: [null, [Validators.required]],
    project_data_form_id: [null, [Validators.required]],
  });

  constructor(
    protected projectDataFormItemService: ProjectDataFormItemService,
    protected adminHierarchyService: AdminHierarchyService,
    protected financialYearService: FinancialYearService,
    protected projectDataFormQuestionService: ProjectDataFormQuestionService,
    protected sectionService: SectionService,
    protected projectService: ProjectService,
    protected projectDataFormService: ProjectDataFormService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.adminHierarchyService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<AdminHierarchy[]>) =>
          (this.adminHierarchies = resp.data)
      );
    this.financialYearService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<FinancialYear[]>) =>
          (this.financialYears = resp.data)
      );
    this.projectDataFormQuestionService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<ProjectDataFormQuestion[]>) =>
          (this.projectDataFormQuestions = resp.data)
      );
    this.sectionService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<Section[]>) => (this.sections = resp.data)
      );
    this.projectService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<Project[]>) => (this.projects = resp.data)
      );
    this.projectDataFormService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<ProjectDataForm[]>) =>
          (this.projectDataForms = resp.data)
      );
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create ProjectDataFormItem or Update Facility type if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const projectDataFormItem = this.createFromForm();
    if (projectDataFormItem.id !== undefined) {
      this.subscribeToSaveResponse(
        this.projectDataFormItemService.update(projectDataFormItem)
      );
    } else {
      this.subscribeToSaveResponse(
        this.projectDataFormItemService.create(projectDataFormItem)
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<ProjectDataFormItem>>
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
   * @param projectDataFormItem
   */
  protected updateForm(projectDataFormItem: ProjectDataFormItem): void {
    this.editForm.patchValue({
      id: projectDataFormItem.id,
      admin_hierarchy_id: projectDataFormItem.admin_hierarchy_id,
      financial_year_id: projectDataFormItem.financial_year_id,
      project_data_form_question_id:
        projectDataFormItem.project_data_form_question_id,
      section_id: projectDataFormItem.section_id,
      project_id: projectDataFormItem.project_id,
      project_data_form_id: projectDataFormItem.project_data_form_id,
    });
  }

  /**
   * Return form values as object of type ProjectDataFormItem
   * @returns ProjectDataFormItem
   */
  protected createFromForm(): ProjectDataFormItem {
    return {
      ...new ProjectDataFormItem(),
      id: this.editForm.get(["id"])!.value,
      admin_hierarchy_id: this.editForm.get(["admin_hierarchy_id"])!.value,
      financial_year_id: this.editForm.get(["financial_year_id"])!.value,
      project_data_form_question_id: this.editForm.get([
        "project_data_form_question_id",
      ])!.value,
      section_id: this.editForm.get(["section_id"])!.value,
      project_id: this.editForm.get(["project_id"])!.value,
      project_data_form_id: this.editForm.get(["project_data_form_id"])!.value,
    };
  }
}
