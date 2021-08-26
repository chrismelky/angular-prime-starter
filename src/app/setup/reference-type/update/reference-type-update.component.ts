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
import { Sector } from 'src/app/setup/sector/sector.model';
import { SectorService } from 'src/app/setup/sector/sector.service';
import { ReferenceType } from '../reference-type.model';
import { ReferenceTypeService } from '../reference-type.service';
import { ToastService } from 'src/app/shared/toast.service';

@Component({
  selector: 'app-reference-type-update',
  templateUrl: './reference-type-update.component.html',
})
export class ReferenceTypeUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  sectors?: Sector[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    name: [null, [Validators.required]],
    multi_select: [false, [Validators.required]],
    link_level: [null, [Validators.required]],
    sector_id: [null, [Validators.required]],
  });

  constructor(
    protected referenceTypeService: ReferenceTypeService,
    protected sectorService: SectorService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.sectorService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<Sector[]>) => (this.sectors = resp.data)
      );
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create ReferenceType Update if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const referenceType = this.createFromForm();
    if (referenceType.id !== undefined) {
      this.subscribeToSaveResponse(
        this.referenceTypeService.update(referenceType)
      );
    } else {
      this.subscribeToSaveResponse(
        this.referenceTypeService.create(referenceType)
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<ReferenceType>>
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
   * @param referenceType
   */
  protected updateForm(referenceType: ReferenceType): void {
    this.editForm.patchValue({
      id: referenceType.id,
      name: referenceType.name,
      multi_select: referenceType.multi_select,
      link_level: referenceType.link_level,
      sector_id: referenceType.sector_id,
    });
  }

  /**
   * Return form values as object of type ReferenceType
   * @returns ReferenceType
   */
  protected createFromForm(): ReferenceType {
    return {
      ...new ReferenceType(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      multi_select: this.editForm.get(['multi_select'])!.value,
      link_level: this.editForm.get(['link_level'])!.value,
      sector_id: this.editForm.get(['sector_id'])!.value,
    };
  }
}
