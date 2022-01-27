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
import { ProjectDataForm } from "src/app/setup/project-data-form/project-data-form.model";
import { ProjectDataFormService } from "src/app/setup/project-data-form/project-data-form.service";
import { ProjectDataFormQuestion } from "../project-data-form-question.model";
import { ProjectDataFormQuestionService } from "../project-data-form-question.service";
import { ToastService } from "src/app/shared/toast.service";
import { EnumService, PlanrepEnum } from 'src/app/shared/enum.service';


@Component({
  selector: "app-project-data-form-question-update",
  templateUrl: "./project-data-form-question-update.component.html",
})
export class ProjectDataFormQuestionUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  projectDataForms?: ProjectDataForm[] = [];
  projectDataFormInputTypes?: PlanrepEnum[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    name: [null, [Validators.required]],
    code: [null, [Validators.required]],
    input_type: [null, [Validators.required]],
    project_data_form_id: [null, [Validators.required]],
    number: [null, [Validators.required]],
    sort_order: [null, [Validators.required]],
    is_active: [false, []],
  });

  constructor(
    protected projectDataFormQuestionService: ProjectDataFormQuestionService,
    protected projectDataFormService: ProjectDataFormService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService,
    protected enumService: EnumService

  ) {}

  ngOnInit(): void {
    this.projectDataFormService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<ProjectDataForm[]>) =>
          (this.projectDataForms = resp.data)
      );

    this.projectDataFormInputTypes = this.enumService.get('projectDataFormInputType');

    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create ProjectDataFormQuestion or Update Facility type if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const projectDataFormQuestion = this.createFromForm();
    if (projectDataFormQuestion.id !== undefined) {
      this.subscribeToSaveResponse(
        this.projectDataFormQuestionService.update(projectDataFormQuestion)
      );
    } else {
      this.subscribeToSaveResponse(
        this.projectDataFormQuestionService.create(projectDataFormQuestion)
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<ProjectDataFormQuestion>>
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
   * @param projectDataFormQuestion
   */
  protected updateForm(projectDataFormQuestion: ProjectDataFormQuestion): void {
    this.editForm.patchValue({
      id: projectDataFormQuestion.id,
      name: projectDataFormQuestion.name,
      code: projectDataFormQuestion.code,
      input_type: projectDataFormQuestion.input_type,
      project_data_form_id: projectDataFormQuestion.project_data_form_id,
      number: projectDataFormQuestion.number,
      sort_order: projectDataFormQuestion.sort_order,
      is_active: projectDataFormQuestion.is_active,
    });
  }

  /**
   * Return form values as object of type ProjectDataFormQuestion
   * @returns ProjectDataFormQuestion
   */
  protected createFromForm(): ProjectDataFormQuestion {
    return {
      ...new ProjectDataFormQuestion(),
      id: this.editForm.get(["id"])!.value,
      name: this.editForm.get(["name"])!.value,
      code: this.editForm.get(["code"])!.value,
      input_type: this.editForm.get(["input_type"])!.value,
      project_data_form_id: this.editForm.get(["project_data_form_id"])!.value,
      number: this.editForm.get(["number"])!.value,
      sort_order: this.editForm.get(["sort_order"])!.value,
      is_active: this.editForm.get(["is_active"])!.value,
    };
  }
}
