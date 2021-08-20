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
import { ActivityType } from "src/app/setup/activity-type/activity-type.model";
import { ActivityTypeService } from "src/app/setup/activity-type/activity-type.service";
import { ActivityTaskNature } from "../activity-task-nature.model";
import { ActivityTaskNatureService } from "../activity-task-nature.service";
import { ToastService } from "src/app/shared/toast.service";

@Component({
  selector: "app-activity-task-nature-update",
  templateUrl: "./activity-task-nature-update.component.html",
})
export class ActivityTaskNatureUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  activityTypes?: ActivityType[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    name: [null, [Validators.required]],
    code: [null, [Validators.required]],
    activity_type_id: [null, [Validators.required]],
  });

  constructor(
    protected activityTaskNatureService: ActivityTaskNatureService,
    protected activityTypeService: ActivityTypeService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.activityTypeService
      .query()
      .subscribe(
        (resp: CustomResponse<ActivityType[]>) =>
          (this.activityTypes = resp.data)
      );
    this.updateForm(this.dialogConfig.data); //Initilize form with data from dialog
  }

  /**
   * When form is valid Create ActivityTaskNature or Update Facilitiy type if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const activityTaskNature = this.createFromForm();
    if (activityTaskNature.id !== undefined) {
      this.subscribeToSaveResponse(
        this.activityTaskNatureService.update(activityTaskNature)
      );
    } else {
      this.subscribeToSaveResponse(
        this.activityTaskNatureService.create(activityTaskNature)
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<ActivityTaskNature>>
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
   * @param activityTaskNature
   */
  protected updateForm(activityTaskNature: ActivityTaskNature): void {
    this.editForm.patchValue({
      id: activityTaskNature.id,
      name: activityTaskNature.name,
      code: activityTaskNature.code,
      activity_type_id: activityTaskNature.activity_type_id,
    });
  }

  /**
   * Return form values as object of type ActivityTaskNature
   * @returns ActivityTaskNature
   */
  protected createFromForm(): ActivityTaskNature {
    return {
      ...new ActivityTaskNature(),
      id: this.editForm.get(["id"])!.value,
      name: this.editForm.get(["name"])!.value,
      code: this.editForm.get(["code"])!.value,
      activity_type_id: this.editForm.get(["activity_type_id"])!.value,
    };
  }
}
