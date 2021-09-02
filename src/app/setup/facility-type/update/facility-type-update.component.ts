/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import {Component, Inject, OnInit} from "@angular/core";
import {FormBuilder, Validators} from "@angular/forms";
import {Observable} from "rxjs";
import {finalize} from "rxjs/operators";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";

import {CustomResponse} from "../../../utils/custom-response";
import {EnumService, PlanrepEnum} from "src/app/shared/enum.service";
import {AdminHierarchyLevel} from "src/app/setup/admin-hierarchy-level/admin-hierarchy-level.model";
import {AdminHierarchyLevelService} from "src/app/setup/admin-hierarchy-level/admin-hierarchy-level.service";
import {FacilityType} from "../facility-type.model";
import {FacilityTypeService} from "../facility-type.service";
import {ToastService} from "src/app/shared/toast.service";

@Component({
  selector: "app-facility-type-update",
  templateUrl: "./facility-type-update.component.html",
})
export class FacilityTypeUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  adminHierarchyLevels?: AdminHierarchyLevel[] = [];
  lgaLevels?: PlanrepEnum[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null],
    code: ['', [Validators.required]],
    name: ['', [Validators.required]],
    lga_level: ['LLG', [Validators.required]],
    admin_hierarchy_level_id: [null, [Validators.required]],
  });

  constructor(
    protected facilityTypeService: FacilityTypeService,
    protected adminHierarchyLevelService: AdminHierarchyLevelService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService,
    protected enumService: EnumService
  ) {
  }

  ngOnInit(): void {
    this.adminHierarchyLevelService
      .query({columns: ["id", "name"]})
      .subscribe(
        (resp: CustomResponse<AdminHierarchyLevel[]>) =>
          (this.adminHierarchyLevels = resp.data)
      );
    this.lgaLevels = this.enumService.get("lgaLevels");
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create FacilityType or Update Facility type if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
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
  protected onSaveError(error: any): void {
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  /**
   * Set/Initialize form values
   * @param facilityType
   */
  protected updateForm(facilityType: FacilityType): void {
    this.editForm.patchValue({
      id: facilityType.id,
      code: facilityType.code,
      name: facilityType.name,
      lga_level: facilityType.lga_level,
      admin_hierarchy_level_id: facilityType.admin_hierarchy_level_id,
    });
  }

  /**
   * Return form values as object of type FacilityType
   * @returns FacilityType
   */
  protected createFromForm(): FacilityType {
    return {
      ...new FacilityType(),
      id: this.editForm.get(["id"])!.value,
      code: this.editForm.get(["code"])!.value,
      name: this.editForm.get(["name"])!.value,
      lga_level: this.editForm.get(["lga_level"])!.value,
      admin_hierarchy_level_id: this.editForm.get(["admin_hierarchy_level_id"])!.value,
    };
  }
}
