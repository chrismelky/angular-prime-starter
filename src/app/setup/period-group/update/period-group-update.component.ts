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
import { PeriodGroup } from "../period-group.model";
import { PeriodGroupService } from "../period-group.service";
import { ToastService } from "src/app/shared/toast.service";

@Component({
  selector: "app-period-group-update",
  templateUrl: "./period-group-update.component.html",
})
export class PeriodGroupUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    name: [null, [Validators.required]],
    number: [null, [Validators.required]],
  });

  constructor(
    protected periodGroupService: PeriodGroupService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create PeriodGroup or Update Facility type if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const periodGroup = this.createFromForm();
    if (periodGroup.id !== undefined) {
      this.subscribeToSaveResponse(this.periodGroupService.update(periodGroup));
    } else {
      this.subscribeToSaveResponse(this.periodGroupService.create(periodGroup));
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<PeriodGroup>>
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
   * @param periodGroup
   */
  protected updateForm(periodGroup: PeriodGroup): void {
    this.editForm.patchValue({
      id: periodGroup.id,
      name: periodGroup.name,
      number: periodGroup.number
    });
  }

  /**
   * Return form values as object of type PeriodGroup
   * @returns PeriodGroup
   */
  protected createFromForm(): PeriodGroup {
    return {
      ...new PeriodGroup(),
      id: this.editForm.get(["id"])!.value,
      name: this.editForm.get(["name"])!.value,
      number: this.editForm.get(["number"])!.value,
    };
  }
}
