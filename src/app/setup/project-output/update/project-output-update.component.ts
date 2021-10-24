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
import { Project } from 'src/app/setup/project/project.model';
import { ProjectService } from 'src/app/setup/project/project.service';
import { ProjectOutput } from '../project-output.model';
import { ProjectOutputService } from '../project-output.service';
import { ToastService } from 'src/app/shared/toast.service';
import { ExpenditureCategory } from '../../expenditure-category/expenditure-category.model';
import { Sector } from '../../sector/sector.model';

@Component({
  selector: 'app-project-output-update',
  templateUrl: './project-output-update.component.html',
})
export class ProjectOutputUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  expenditureCategories?: ExpenditureCategory[] = [];
  sectors?: Sector[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    name: [null, [Validators.required]],
    expenditure_category_id: [null, [Validators.required]],
    sector_id: [null, [Validators.required]],
    is_active: [null, []],
  });

  constructor(
    protected projectOutputService: ProjectOutputService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    const dialogData = this.dialogConfig.data;
    this.expenditureCategories = dialogData.expenditureCategories;
    this.sectors = dialogData.sectors;
    this.updateForm(dialogData.projectOutPut); //Initialize form with data from dialog
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
      expenditure_category_id: projectOutput.expenditure_category_id,
      sector_id: projectOutput.sector_id,
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
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      expenditure_category_id: this.editForm.get(['expenditure_category_id'])!
        .value,
      sector_id: this.editForm.get(['sector_id'])!.value,
      is_active: this.editForm.get(['is_active'])!.value,
    };
  }
}
