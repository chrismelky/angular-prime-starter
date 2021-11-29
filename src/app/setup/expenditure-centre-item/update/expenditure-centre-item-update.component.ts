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
import { ExpenditureCentre } from 'src/app/setup/expenditure-centre/expenditure-centre.model';
import { ExpenditureCentreService } from 'src/app/setup/expenditure-centre/expenditure-centre.service';
import { ExpenditureCentreItem } from '../expenditure-centre-item.model';
import { ExpenditureCentreItemService } from '../expenditure-centre-item.service';
import { ToastService } from 'src/app/shared/toast.service';
import { GfsCode } from '../../gfs-code/gfs-code.model';
import { GfsCodeService } from '../../gfs-code/gfs-code.service';

@Component({
  selector: 'app-expenditure-centre-item-update',
  templateUrl: './expenditure-centre-item-update.component.html',
})
export class ExpenditureCentreItemUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];
  gfsCodes?: GfsCode[] = [];

  expenditureCentres?: ExpenditureCentre[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    name: [null, [Validators.required]],
    percentage: [null, []],
    expenditure_centre_id: [null, [Validators.required]],
    gfs_codes: [[], [Validators.required]],
  });

  constructor(
    protected expenditureCentreItemService: ExpenditureCentreItemService,
    protected expenditureCentreService: ExpenditureCentreService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService,
    protected gfsCodeService: GfsCodeService
  ) {}

  ngOnInit(): void {
    this.expenditureCentreService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<ExpenditureCentre[]>) =>
          (this.expenditureCentres = resp.data)
      );
    this.gfsCodeService.expenditure().subscribe((resp) => {
      this.gfsCodes = resp.data;
    });
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create ExpenditureCentreItem or Update Facility type if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const expenditureCentreItem = this.createFromForm();
    if (expenditureCentreItem.id !== undefined) {
      this.subscribeToSaveResponse(
        this.expenditureCentreItemService.update(expenditureCentreItem)
      );
    } else {
      this.subscribeToSaveResponse(
        this.expenditureCentreItemService.create(expenditureCentreItem)
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<ExpenditureCentreItem>>
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
   * @param expenditureCentreItem
   */
  protected updateForm(expenditureCentreItem: ExpenditureCentreItem): void {
    this.editForm.patchValue({
      id: expenditureCentreItem.id,
      name: expenditureCentreItem.name,
      percentage: expenditureCentreItem.percentage,
      expenditure_centre_id: expenditureCentreItem.expenditure_centre_id,
      gfs_codes: expenditureCentreItem.gfs_codes,
    });
  }

  /**
   * Return form values as object of type ExpenditureCentreItem
   * @returns ExpenditureCentreItem
   */
  protected createFromForm(): ExpenditureCentreItem {
    return {
      ...new ExpenditureCentreItem(),
      ...this.editForm.value,
    };
  }
}
