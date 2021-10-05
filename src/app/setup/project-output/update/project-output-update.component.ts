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
import { Project } from "src/app/setup/project/project.model";
import { ProjectService } from "src/app/setup/project/project.service";
import { ProjectOutput } from "../project-output.model";
import { ProjectOutputService } from "../project-output.service";
import { ToastService } from "src/app/shared/toast.service";

@Component({
  selector: "app-project-output-update",
  templateUrl: "./project-output-update.component.html",
})
export class ProjectOutputUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  projects?: Project[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    name: [null, [Validators.required]],
    project_id: [null, [Validators.required]],
    is_active: [false, []],
  });

  constructor(
    protected projectOutputService: ProjectOutputService,
    protected projectService: ProjectService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.projectService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<Project[]>) => (this.projects = resp.data)
      );
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create ProjectOutput or Update Facility type if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const projectOutput = this.createFromForm();
    if (projectOutput.id !== undefined) {
      this.subscribeToSaveResponse(
        this.projectOutputService.update(projectOutput)
      );
    } else {
      this.subscribeToSaveResponse(
        this.projectOutputService.create(projectOutput)
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<ProjectOutput>>
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
   * @param projectOutput
   */
  protected updateForm(projectOutput: ProjectOutput): void {
    this.editForm.patchValue({
      id: projectOutput.id,
      name: projectOutput.name,
      project_id: projectOutput.project_id,
      is_active: projectOutput.is_active,
    });
  }

  /**
   * Return form values as object of type ProjectOutput
   * @returns ProjectOutput
   */
  protected createFromForm(): ProjectOutput {
    return {
      ...new ProjectOutput(),
      id: this.editForm.get(["id"])!.value,
      name: this.editForm.get(["name"])!.value,
      project_id: this.editForm.get(["project_id"])!.value,
      is_active: this.editForm.get(["is_active"])!.value,
    };
  }
}
