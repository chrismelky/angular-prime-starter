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

import { CustomResponse } from '../../../../utils/custom-response';
import { FacilityType } from 'src/app/setup/facility-type/facility-type.model';
import { FacilityTypeService } from 'src/app/setup/facility-type/facility-type.service';
import { Section } from 'src/app/setup/section/section.model';
import { SectionService } from 'src/app/setup/section/section.service';
import { FacilityTypeSection } from '../facility-type-section.model';
import { FacilityTypeSectionService } from '../facility-type-section.service';
import { ToastService } from 'src/app/shared/toast.service';

@Component({
  selector: 'app-facility-type-section-update',
  templateUrl: './facility-type-section-update.component.html',
})
export class FacilityTypeSectionUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];
  facilityType: FacilityType | undefined;
  facilityTypes?: FacilityType[] = [];
  sections?: Section[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null],
    section_id: [null, [Validators.required]],
  });

  constructor(
    protected facilityTypeSectionService: FacilityTypeSectionService,
    protected facilityTypeService: FacilityTypeService,
    protected sectionService: SectionService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {
    this.facilityType = dialogConfig.data.facility_type;
  }

  ngOnInit(): void {
    this.facilityTypeService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<FacilityType[]>) =>
          (this.facilityTypes = resp.data)
      );
    this.sectionService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<Section[]>) => (this.sections = resp.data)
      );
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create FacilityTypeSection or Update if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const facilityTypeSection = this.createFromForm();
    facilityTypeSection.facility_type_id = this.facilityType?.id;
    if (facilityTypeSection.id !== undefined) {
      this.subscribeToSaveResponse(
        this.facilityTypeSectionService.update(facilityTypeSection)
      );
    } else {
      this.subscribeToSaveResponse(
        this.facilityTypeSectionService.create(facilityTypeSection)
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<FacilityTypeSection>>
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
   * @param facilityTypeSection
   */
  protected updateForm(facilityTypeSection: FacilityTypeSection): void {
    this.editForm.patchValue({
      id: facilityTypeSection.id,
      section_id: facilityTypeSection.section_id,
    });
  }

  /**
   * Return form values as object of type FacilityTypeSection
   * @returns FacilityTypeSection
   */
  protected createFromForm(): FacilityTypeSection {
    return {
      ...new FacilityTypeSection(),
      id: this.editForm.get(['id'])!.value,
      section_id: this.editForm.get(['section_id'])!.value,
    };
  }
}
