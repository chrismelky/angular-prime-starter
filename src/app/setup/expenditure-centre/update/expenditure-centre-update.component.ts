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
import { ExpenditureCentre } from '../expenditure-centre.model';
import { ExpenditureCentreService } from '../expenditure-centre.service';
import { ToastService } from 'src/app/shared/toast.service';
import { Sector } from '../../sector/sector.model';
import { FundSource } from '../../fund-source/fund-source.model';
import { FundSourceService } from '../../fund-source/fund-source.service';
import { SectorService } from '../../sector/sector.service';

@Component({
  selector: 'app-expenditure-centre-update',
  templateUrl: './expenditure-centre-update.component.html',
})
export class ExpenditureCentreUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];
  sectors?: Sector[] = [];
  fundSources?: FundSource[] = [];
  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    name: [null, [Validators.required]],
    percentage: [null, [Validators.required]],
    sectors: [[], [Validators.required]],
    fund_sources: [[], [Validators.required]],
  });

  constructor(
    protected expenditureCentreService: ExpenditureCentreService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService,
    protected fundSourceService: FundSourceService,
    protected sectorService: SectorService
  ) {}

  ngOnInit(): void {
    this.sectorService
      .query({
        columns: ['id', 'name'],
      })
      .subscribe((resp) => {
        this.sectors = resp.data;
      });

    this.fundSourceService
      .query({
        columns: ['id', 'name'],
      })
      .subscribe((resp) => {
        this.fundSources = resp.data;
      });
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create ExpenditureCentre or Update Facility type if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const expenditureCentre = this.createFromForm();
    if (expenditureCentre.id !== undefined) {
      this.subscribeToSaveResponse(
        this.expenditureCentreService.update(expenditureCentre)
      );
    } else {
      this.subscribeToSaveResponse(
        this.expenditureCentreService.create(expenditureCentre)
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<ExpenditureCentre>>
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
   * @param expenditureCentre
   */
  protected updateForm(expenditureCentre: ExpenditureCentre): void {
    this.editForm.patchValue({
      id: expenditureCentre.id,
      name: expenditureCentre.name,
      percentage: expenditureCentre.percentage,
      fund_sources: expenditureCentre.fund_sources,
      sectors: expenditureCentre.sectors,
    });
  }

  /**
   * Return form values as object of type ExpenditureCentre
   * @returns ExpenditureCentre
   */
  protected createFromForm(): ExpenditureCentre {
    return {
      ...new ExpenditureCentre(),
      ...this.editForm.value,
    };
  }
}
