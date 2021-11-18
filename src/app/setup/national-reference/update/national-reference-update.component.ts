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
import { ReferenceType } from 'src/app/setup/reference-type/reference-type.model';
import { ReferenceTypeService } from 'src/app/setup/reference-type/reference-type.service';
import { NationalReference } from '../national-reference.model';
import { NationalReferenceService } from '../national-reference.service';
import { ToastService } from 'src/app/shared/toast.service';
import { SectorService } from '../../sector/sector.service';
import { Sector } from '../../sector/sector.model';

@Component({
  selector: 'app-national-reference-update',
  templateUrl: './national-reference-update.component.html',
})
export class NationalReferenceUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  referenceTypes?: ReferenceType[] = [];
  parents?: NationalReference[] = [];
  linkLevels?: PlanrepEnum[] = [];
  sectors?: Sector[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    code: [null, [Validators.required]],
    description: [null, [Validators.required]],
    reference_type_id: [null, [Validators.required]],
    parent_id: [null, []],
    link_level: [null, [Validators.required]],
    sectors: [[], [Validators.required]],
  });

  constructor(
    protected nationalReferenceService: NationalReferenceService,
    protected referenceTypeService: ReferenceTypeService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService,
    protected enumService: EnumService,
    protected sectorService: SectorService
  ) {}

  ngOnInit(): void {
    this.sectorService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<Sector[]>) => (this.sectors = resp.data)
      );
    this.referenceTypeService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<ReferenceType[]>) =>
          (this.referenceTypes = resp.data)
      );
    this.linkLevels = this.enumService.get('linkLevels');
    const dialogData = this.dialogConfig.data;

    this.parents = dialogData.parents;
    this.updateForm(dialogData.reference); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create NationalReference or Update if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const nationalReference = this.createFromForm();
    if (nationalReference.id !== undefined) {
      this.subscribeToSaveResponse(
        this.nationalReferenceService.update(nationalReference)
      );
    } else {
      this.subscribeToSaveResponse(
        this.nationalReferenceService.create(nationalReference)
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<NationalReference>>
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
   * @param nationalReference
   */
  protected updateForm(nationalReference: NationalReference): void {
    // object Array to int array
    this.editForm.patchValue({
      id: nationalReference.id,
      code: nationalReference.code,
      description: nationalReference.description,
      reference_type_id: nationalReference.reference_type_id,
      parent_id: nationalReference.parent_id,
      link_level: nationalReference.link_level,
      sectors: nationalReference.sectors,
    });
  }

  /**
   * Return form values as object of type NationalReference
   * @returns NationalReference
   */
  protected createFromForm(): NationalReference {
    return {
      ...new NationalReference(),
      id: this.editForm.get(['id'])!.value,
      code: this.editForm.get(['code'])!.value,
      description: this.editForm.get(['description'])!.value,
      reference_type_id: this.editForm.get(['reference_type_id'])!.value,
      parent_id: this.editForm.get(['parent_id'])!.value,
      link_level: this.editForm.get(['link_level'])!.value,
      sectors: this.editForm.get(['sectors'])!.value,
    };
  }
}
