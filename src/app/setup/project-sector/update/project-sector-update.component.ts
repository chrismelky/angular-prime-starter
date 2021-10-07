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
import { Sector } from "src/app/setup/sector/sector.model";
import { SectorService } from "src/app/setup/sector/sector.service";
import { ProjectSector } from "../project-sector.model";
import { ProjectSectorService } from "../project-sector.service";
import { ToastService } from "src/app/shared/toast.service";

@Component({
  selector: "app-project-sector-update",
  templateUrl: "./project-sector-update.component.html",
})
export class ProjectSectorUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  projects?: Project[] = [];
  sectors?: Sector[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    project_id: [null, [Validators.required]],
    sector_id: [null, [Validators.required]],
  });

  constructor(
    protected projectSectorService: ProjectSectorService,
    protected projectService: ProjectService,
    protected sectorService: SectorService,
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
    this.sectorService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<Sector[]>) => (this.sectors = resp.data)
      );
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create ProjectSector or Update Facility type if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const projectSector = this.createFromForm();
    if (projectSector.id !== undefined) {
      this.subscribeToSaveResponse(
        this.projectSectorService.update(projectSector)
      );
    } else {
      this.subscribeToSaveResponse(
        this.projectSectorService.create(projectSector)
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<ProjectSector>>
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
   * @param projectSector
   */
  protected updateForm(projectSector: ProjectSector): void {
    this.editForm.patchValue({
      id: projectSector.id,
      project_id: projectSector.project_id,
      sector_id: projectSector.sector_id,
    });
  }

  /**
   * Return form values as object of type ProjectSector
   * @returns ProjectSector
   */
  protected createFromForm(): ProjectSector {
    return {
      ...new ProjectSector(),
      id: this.editForm.get(["id"])!.value,
      project_id: this.editForm.get(["project_id"])!.value,
      sector_id: this.editForm.get(["sector_id"])!.value,
    };
  }
}
