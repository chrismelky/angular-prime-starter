import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { CustomResponse } from '../../../utils/custom-response';

import { FacilityType } from '../facility-type.model';
import { FacilityTypeService } from '../facility-type.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ToastService } from 'src/app/shared/toast.service';

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
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.updateForm(this.dialogConfig.data);
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
      (result) => this.onSaveSuccess(result),
      (error) => this.onSaveError(error)
    );
  }

  protected onSaveSuccess(result: any): void {
    this.toastService.info(result.message);
    this.dialogRef.close(true);
  }

  protected onSaveError(error: any): void {}

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
