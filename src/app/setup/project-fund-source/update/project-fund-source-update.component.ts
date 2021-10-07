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
import { FundSource } from "src/app/setup/fund-source/fund-source.model";
import { FundSourceService } from "src/app/setup/fund-source/fund-source.service";
import { ProjectFundSource } from "../project-fund-source.model";
import { ProjectFundSourceService } from "../project-fund-source.service";
import { ToastService } from "src/app/shared/toast.service";

@Component({
  selector: "app-project-fund-source-update",
  templateUrl: "./project-fund-source-update.component.html",
})
export class ProjectFundSourceUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  projects?: Project[] = [];
  fundSources?: FundSource[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    project_id: [null, [Validators.required]],
    fund_source_id: [null, [Validators.required]],
  });

  constructor(
    protected projectFundSourceService: ProjectFundSourceService,
    protected projectService: ProjectService,
    protected fundSourceService: FundSourceService,
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
    this.fundSourceService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<FundSource[]>) => (this.fundSources = resp.data)
      );
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create ProjectFundSource or Update Facility type if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const projectFundSource = this.createFromForm();
    if (projectFundSource.id !== undefined) {
      this.subscribeToSaveResponse(
        this.projectFundSourceService.update(projectFundSource)
      );
    } else {
      this.subscribeToSaveResponse(
        this.projectFundSourceService.create(projectFundSource)
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<ProjectFundSource>>
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
   * @param projectFundSource
   */
  protected updateForm(projectFundSource: ProjectFundSource): void {
    this.editForm.patchValue({
      id: projectFundSource.id,
      project_id: projectFundSource.project_id,
      fund_source_id: projectFundSource.fund_source_id,
    });
  }

  /**
   * Return form values as object of type ProjectFundSource
   * @returns ProjectFundSource
   */
  protected createFromForm(): ProjectFundSource {
    return {
      ...new ProjectFundSource(),
      id: this.editForm.get(["id"])!.value,
      project_id: this.editForm.get(["project_id"])!.value,
      fund_source_id: this.editForm.get(["fund_source_id"])!.value,
    };
  }
}
