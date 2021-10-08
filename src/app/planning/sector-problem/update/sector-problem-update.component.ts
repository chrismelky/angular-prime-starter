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
import { PriorityArea } from 'src/app/setup/priority-area/priority-area.model';
import { PriorityAreaService } from 'src/app/setup/priority-area/priority-area.service';
import { AdminHierarchy } from 'src/app/setup/admin-hierarchy/admin-hierarchy.model';
import { AdminHierarchyService } from 'src/app/setup/admin-hierarchy/admin-hierarchy.service';
import { GenericSectorProblem } from 'src/app/setup/generic-sector-problem/generic-sector-problem.model';
import { GenericSectorProblemService } from 'src/app/setup/generic-sector-problem/generic-sector-problem.service';
import { SectorProblem } from '../sector-problem.model';
import { SectorProblemService } from '../sector-problem.service';
import { ToastService } from 'src/app/shared/toast.service';

@Component({
  selector: 'app-sector-problem-update',
  templateUrl: './sector-problem-update.component.html',
})
export class SectorProblemUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  priorityAreas?: PriorityArea[] = [];
  adminHierarchies?: AdminHierarchy[] = [];
  genericSectorProblems?: GenericSectorProblem[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    description: [null, [Validators.required]],
    number: [null, [Validators.required]],
    is_active: [false, [Validators.required]],
    priority_area_id: [null, [Validators.required]],
    admin_hierarchy_id: [null, [Validators.required]],
    generic_sector_problem_id: [null, []],
  });

  constructor(
    protected sectorProblemService: SectorProblemService,
    protected priorityAreaService: PriorityAreaService,
    protected adminHierarchyService: AdminHierarchyService,
    protected genericSectorProblemService: GenericSectorProblemService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.genericSectorProblemService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<GenericSectorProblem[]>) =>
          (this.genericSectorProblems = resp.data)
      );
    const dialogData = this.dialogConfig.data;
    this.adminHierarchies = dialogData.adminHierarchies;
    this.priorityAreas = dialogData.priorityAreas;
    this.updateForm(dialogData.sectorProblem); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create SectorProblem or Update Facility type if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const sectorProblem = this.createFromForm();
    if (sectorProblem.id !== undefined) {
      this.subscribeToSaveResponse(
        this.sectorProblemService.update(sectorProblem)
      );
    } else {
      this.subscribeToSaveResponse(
        this.sectorProblemService.create(sectorProblem)
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<SectorProblem>>
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
   * @param sectorProblem
   */
  protected updateForm(sectorProblem: SectorProblem): void {
    this.editForm.patchValue({
      id: sectorProblem.id,
      description: sectorProblem.description,
      number: sectorProblem.number,
      is_active: sectorProblem.is_active,
      priority_area_id: sectorProblem.priority_area_id,
      admin_hierarchy_id: sectorProblem.admin_hierarchy_id,
      generic_sector_problem_id: sectorProblem.generic_sector_problem_id,
    });
  }

  /**
   * Return form values as object of type SectorProblem
   * @returns SectorProblem
   */
  protected createFromForm(): SectorProblem {
    return {
      ...new SectorProblem(),
      id: this.editForm.get(['id'])!.value,
      description: this.editForm.get(['description'])!.value,
      number: this.editForm.get(['number'])!.value,
      is_active: this.editForm.get(['is_active'])!.value,
      priority_area_id: this.editForm.get(['priority_area_id'])!.value,
      admin_hierarchy_id: this.editForm.get(['admin_hierarchy_id'])!.value,
      generic_sector_problem_id: this.editForm.get([
        'generic_sector_problem_id',
      ])!.value,
    };
  }
}
