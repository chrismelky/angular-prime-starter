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
import { Sector } from 'src/app/setup/sector/sector.model';
import { SectorService } from 'src/app/setup/sector/sector.service';
import { AdminHierarchyLevel } from 'src/app/setup/admin-hierarchy-level/admin-hierarchy-level.model';
import { AdminHierarchyLevelService } from 'src/app/setup/admin-hierarchy-level/admin-hierarchy-level.service';
import { CasPlan } from '../cas-plan.model';
import { CasPlanService } from '../cas-plan.service';
import { ToastService } from 'src/app/shared/toast.service';

@Component({
  selector: 'app-cas-plan-update',
  templateUrl: './cas-plan-update.component.html',
})
export class CasPlanUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  sectors?: Sector[] = [];
  adminHierarchyLevels?: AdminHierarchyLevel[] = [];
  periodTypes?: PlanrepEnum[] = [];
  contentTypes?: PlanrepEnum[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    name: ['', [Validators.required, Validators.maxLength(250)]],
    sector_id: [null, [Validators.required]],
    admin_hierarchy_position: [null, [Validators.required]],
    period_type: ['Quarterly', [Validators.required]],
    content_type: ['CAS', [Validators.required]],
    is_active: [false, [Validators.required]],
  });

  constructor(
    protected casPlanService: CasPlanService,
    protected sectorService: SectorService,
    protected adminHierarchyLevelService: AdminHierarchyLevelService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService,
    protected enumService: EnumService
  ) {}

  ngOnInit(): void {
    this.sectorService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<Sector[]>) => (this.sectors = resp.data)
      );
    this.adminHierarchyLevelService
      .query({ columns: ['id', 'name', 'position'] })
      .subscribe(
        (resp: CustomResponse<AdminHierarchyLevel[]>) =>
          (this.adminHierarchyLevels = resp.data)
      );
    this.periodTypes = this.enumService.get('periodTypes');
    this.contentTypes = this.enumService.get('contentTypes');
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create CasPlan Update if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const casPlan = this.createFromForm();
    if (casPlan.id !== undefined) {
      this.subscribeToSaveResponse(this.casPlanService.update(casPlan));
    } else {
      this.subscribeToSaveResponse(this.casPlanService.create(casPlan));
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<CasPlan>>
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
   * @param casPlan
   */
  protected updateForm(casPlan: CasPlan): void {
    this.editForm.patchValue({
      id: casPlan.id,
      name: casPlan.name,
      sector_id: casPlan.sector_id,
      admin_hierarchy_position: casPlan.admin_hierarchy_position,
      period_type: casPlan.period_type,
      content_type: casPlan.content_type,
      is_active: casPlan.is_active,
    });
  }

  /**
   * Return form values as object of type CasPlan
   * @returns CasPlan
   */
  protected createFromForm(): CasPlan {
    return {
      ...new CasPlan(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      sector_id: this.editForm.get(['sector_id'])!.value,
      admin_hierarchy_position: this.editForm.get(['admin_hierarchy_position'])!
        .value,
      period_type: this.editForm.get(['period_type'])!.value,
      content_type: this.editForm.get(['content_type'])!.value,
      is_active: this.editForm.get(['is_active'])!.value,
    };
  }
}
