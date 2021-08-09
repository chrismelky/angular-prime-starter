import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { CustomResponse } from '../../../utils/custom-response';

import { FacilityType } from '../facility-type.model';
import { FacilityTypeService } from '../facility-type.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  DynamicDialogComponent,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';

@Component({
  selector: 'app-facility-type-update',
  templateUrl: './facility-type-update.component.html',
})
export class FacilityTypeUpdateComponent implements OnInit {
  isSaving = false;
  errors = [];

  editForm = this.fb.group({
    id: [null, []],
    name: [null, [Validators.required]],
    code: [null],
  });

  constructor(
    protected facilityTypeService: FacilityTypeService,
    // public dialogRef: MatDialogRef<FacilityTypeUpdateComponent>,
    public dialogRef: DynamicDialogRef,
    public config: DynamicDialogConfig,
    // @Inject(MAT_DIALOG_DATA) public facilityType: FacilityType,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    // this.updateForm(this.facilityType);
    this.updateForm(this.config.data);
  }

  close(): void {
    this.dialogRef.close(true);
  }

  save(): void {
    if (this.editForm.invalid) {
      return;
    }
    this.isSaving = true;
    const facilityType = this.createFromForm();
    if (facilityType.id !== undefined) {
      this.subscribeToSaveResponse(
        this.facilityTypeService.update(facilityType)
      );
    } else {
      this.subscribeToSaveResponse(
        this.facilityTypeService.create(facilityType)
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<FacilityType>>
  ): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      (error) => this.onSaveError(error)
    );
  }

  protected onSaveSuccess(): void {
    this.dialogRef.close();
  }

  protected onSaveError(error: any): void {
    // Api for inheritance.
    console.log(error);
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(facilityType: FacilityType): void {
    this.editForm.patchValue({
      id: facilityType.id,
      name: facilityType.name,
      code: facilityType.code,
    });
  }

  protected createFromForm(): FacilityType {
    return {
      ...new FacilityType(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      code: this.editForm.get(['code'])!.value,
    };
  }
}
