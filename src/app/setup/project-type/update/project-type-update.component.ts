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
import { ProjectType } from "../project-type.model";
import { ProjectTypeService } from "../project-type.service";
import { ToastService } from "src/app/shared/toast.service";

@Component({
  selector: "app-project-type-update",
  templateUrl: "./project-type-update.component.html",
})
export class ProjectTypeUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    name: [null, [Validators.required]],
    code: [null, [Validators.required]],
    is_active: [true, []],
  });

  constructor(
    protected projectTypeService: ProjectTypeService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create ProjectType or Update Facility type if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const projectType = this.createFromForm();
    if (projectType.id !== undefined) {
      this.subscribeToSaveResponse(this.projectTypeService.update(projectType));
    } else {
      this.subscribeToSaveResponse(this.projectTypeService.create(projectType));
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<ProjectType>>
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
   * @param projectType
   */
  protected updateForm(projectType: ProjectType): void {
    this.editForm.patchValue({
      id: projectType.id,
      name: projectType.name,
      code: projectType.code,
      is_active: projectType.is_active,
    });
  }

  /**
   * Return form values as object of type ProjectType
   * @returns ProjectType
   */
  protected createFromForm(): ProjectType {
    return {
      ...new ProjectType(),
      id: this.editForm.get(["id"])!.value,
      name: this.editForm.get(["name"])!.value,
      code: this.editForm.get(["code"])!.value,
      is_active: this.editForm.get(["is_active"])!.value,
    };
  }
}
