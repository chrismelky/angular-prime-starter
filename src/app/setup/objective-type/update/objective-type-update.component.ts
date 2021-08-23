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
import { ObjectiveType } from "../objective-type.model";
import { ObjectiveTypeService } from "../objective-type.service";
import { ToastService } from "src/app/shared/toast.service";

@Component({
  selector: "app-objective-type-update",
  templateUrl: "./objective-type-update.component.html",
})
export class ObjectiveTypeUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    name: [null, [Validators.required]],
    position: [null, [Validators.required]],
  });

  constructor(
    protected objectiveTypeService: ObjectiveTypeService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.updateForm(this.dialogConfig.data); //Initilize form with data from dialog
  }

  /**
   * When form is valid Create ObjectiveType or Update Facilitiy type if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const objectiveType = this.createFromForm();
    if (objectiveType.id !== undefined) {
      this.subscribeToSaveResponse(
        this.objectiveTypeService.update(objectiveType)
      );
    } else {
      this.subscribeToSaveResponse(
        this.objectiveTypeService.create(objectiveType)
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<ObjectiveType>>
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
   * @param objectiveType
   */
  protected updateForm(objectiveType: ObjectiveType): void {
    this.editForm.patchValue({
      id: objectiveType.id,
      name: objectiveType.name,
      position: objectiveType.position,
    });
  }

  /**
   * Return form values as object of type ObjectiveType
   * @returns ObjectiveType
   */
  protected createFromForm(): ObjectiveType {
    return {
      ...new ObjectiveType(),
      id: this.editForm.get(["id"])!.value,
      name: this.editForm.get(["name"])!.value,
      position: this.editForm.get(["position"])!.value,
    };
  }
}
