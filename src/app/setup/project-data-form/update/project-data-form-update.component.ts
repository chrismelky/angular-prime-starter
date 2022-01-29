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
import { ProjectDataForm } from "../project-data-form.model";
import { ProjectDataFormService } from "../project-data-form.service";
import { ToastService } from "src/app/shared/toast.service";

@Component({
  selector: "app-project-data-form-update",
  templateUrl: "./project-data-form-update.component.html",
})
export class ProjectDataFormUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  parents?: ProjectDataForm[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    name: [null, [Validators.required]],
    code: [null, [Validators.required]],
    parent_id: [null, []],
    is_lowest: [false, []],
    is_active: [false, []],
    sort_order: [null, [Validators.required]],
  });

  constructor(
    protected projectDataFormService: ProjectDataFormService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.projectDataFormService
      .query({ columns: ["id", "name"],parent_id:'' })
      .subscribe(
        (resp: CustomResponse<ProjectDataForm[]>) => (this.parents = resp.data)
      );
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create ProjectDataForm or Update Facility type if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const projectDataForm = this.createFromForm();
    if (projectDataForm.id !== undefined) {
      this.subscribeToSaveResponse(
        this.projectDataFormService.update(projectDataForm)
      );
    } else {
      this.subscribeToSaveResponse(
        this.projectDataFormService.create(projectDataForm)
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<ProjectDataForm>>
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
   * @param projectDataForm
   */
  protected updateForm(projectDataForm: ProjectDataForm): void {
    this.editForm.patchValue({
      id: projectDataForm.id,
      name: projectDataForm.name,
      code: projectDataForm.code,
      parent_id: projectDataForm.parent_id,
      is_lowest: projectDataForm.is_lowest,
      is_active: projectDataForm.is_active,
      sort_order: projectDataForm.sort_order,
    });
  }

  /**
   * Return form values as object of type ProjectDataForm
   * @returns ProjectDataForm
   */
  protected createFromForm(): ProjectDataForm {
    return {
      ...new ProjectDataForm(),
      id: this.editForm.get(["id"])!.value,
      name: this.editForm.get(["name"])!.value,
      code: this.editForm.get(["code"])!.value,
      parent_id: this.editForm.get(["parent_id"])!.value,
      is_lowest: this.editForm.get(["is_lowest"])!.value,
      is_active: this.editForm.get(["is_active"])!.value,
      sort_order: this.editForm.get(["sort_order"])!.value,
    };
  }
}
