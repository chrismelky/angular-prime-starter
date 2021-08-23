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
import { ObjectiveType } from "src/app/setup/objective-type/objective-type.model";
import { ObjectiveTypeService } from "src/app/setup/objective-type/objective-type.service";
import { Objective } from "../objective.model";
import { ObjectiveService } from "../objective.service";
import { ToastService } from "src/app/shared/toast.service";

@Component({
  selector: "app-objective-update",
  templateUrl: "./objective-update.component.html",
})
export class ObjectiveUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  objectiveTypes?: ObjectiveType[] = [];
  parents?: Objective[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    description: [null, [Validators.required]],
    code: [null, [Validators.required]],
    objective_type_id: [null, [Validators.required]],
    parent_id: [null, []],
  });

  constructor(
    protected objectiveService: ObjectiveService,
    protected objectiveTypeService: ObjectiveTypeService,
    protected parentService: ObjectiveService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.objectiveTypeService
      .query()
      .subscribe(
        (resp: CustomResponse<ObjectiveType[]>) =>
          (this.objectiveTypes = resp.data)
      );
    this.parentService
      .query()
      .subscribe(
        (resp: CustomResponse<Objective[]>) => (this.parents = resp.data)
      );
    this.updateForm(this.dialogConfig.data); //Initilize form with data from dialog
  }

  /**
   * When form is valid Create Objective or Update Facilitiy type if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const objective = this.createFromForm();
    if (objective.id !== undefined) {
      this.subscribeToSaveResponse(this.objectiveService.update(objective));
    } else {
      this.subscribeToSaveResponse(this.objectiveService.create(objective));
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<Objective>>
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
   * @param objective
   */
  protected updateForm(objective: Objective): void {
    this.editForm.patchValue({
      id: objective.id,
      description: objective.description,
      code: objective.code,
      objective_type_id: objective.objective_type_id,
      parent_id: objective.parent_id,
    });
  }

  /**
   * Return form values as object of type Objective
   * @returns Objective
   */
  protected createFromForm(): Objective {
    return {
      ...new Objective(),
      id: this.editForm.get(["id"])!.value,
      description: this.editForm.get(["description"])!.value,
      code: this.editForm.get(["code"])!.value,
      objective_type_id: this.editForm.get(["objective_type_id"])!.value,
      parent_id: this.editForm.get(["parent_id"])!.value,
    };
  }
}
