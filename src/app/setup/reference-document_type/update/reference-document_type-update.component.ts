/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";

import { CustomResponse } from "../../../utils/custom-response";
import { ReferenceDocumentType } from "../reference-document_type.model";
import { ReferenceDocumentTypeService } from "../reference-document_type.service";
import { ToastService } from "src/app/shared/toast.service";

@Component({
  selector: "app-reference-document_type-update",
  templateUrl: "./reference-document_type-update.component.html",
})
export class ReferenceDocumentTypeUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    name: [null, [Validators.required]],
  });

  constructor(
    protected referenceDocumentTypeService: ReferenceDocumentTypeService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create ReferenceDocumentType or Update Facility type if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const referenceDocumentType = this.createFromForm();
    if (referenceDocumentType.id !== undefined) {
      this.subscribeToSaveResponse(
        this.referenceDocumentTypeService.update(referenceDocumentType)
      );
    } else {
      this.subscribeToSaveResponse(
        this.referenceDocumentTypeService.create(referenceDocumentType)
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<ReferenceDocumentType>>
  ): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      (result) => this.onSaveSuccess(result),
      (error) => this.onSaveError(error)
    );
  }

  /**
   * When save successfully close dialog and dispaly info message
   * @param result
   */
  protected onSaveSuccess(result: any): void {
    this.toastService.info(result.message);
    this.dialogRef.close(true);
  }

  /**
   * Error handiling specific to this component
   * Note; general error handleing is done by ErrorInterceptor
   * @param error
   */
  protected onSaveError(error: any): void {}

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  /**
   * Set/Initialize form values
   * @param referenceDocumentType
   */
  protected updateForm(referenceDocumentType: ReferenceDocumentType): void {
    this.editForm.patchValue({
      id: referenceDocumentType.id,
      name: referenceDocumentType.name,
    });
  }

  /**
   * Return form values as object of type ReferenceDocumentType
   * @returns ReferenceDocumentType
   */
  protected createFromForm(): ReferenceDocumentType {
    return {
      ...new ReferenceDocumentType(),
      id: this.editForm.get(["id"])!.value,
      name: this.editForm.get(["name"])!.value,
    };
  }
}
