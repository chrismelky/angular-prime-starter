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
import { EnumService, PlanrepEnum } from "src/app/shared/enum.service";
import { GfsCode } from "src/app/setup/gfs-code/gfs-code.model";
import { GfsCodeService } from "src/app/setup/gfs-code/gfs-code.service";
import { PeForm } from "src/app/setup/pe-form/pe-form.model";
import { PeFormService } from "src/app/setup/pe-form/pe-form.service";
import { PeDefinition } from "../pe-definition.model";
import { PeDefinitionService } from "../pe-definition.service";
import { ToastService } from "src/app/shared/toast.service";

@Component({
  selector: "app-pe-definition-update",
  templateUrl: "./pe-definition-update.component.html",
})
export class PeDefinitionUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  parents?: PeDefinition[] = [];
  gfsCodes?: GfsCode[] = [];
  peForms?: PeForm[] = [];
  units?: PlanrepEnum[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    field_name: [null, [Validators.required]],
    parent_id: [null, []],
    gfs_code_id: [null, []],
    unit: [null, [Validators.required]],
    is_input: [false, []],
    has_breakdown: [false, []],
    pe_form_id: [null, [Validators.required]],
    is_active: [false, []],
    column_number: [null, []],
    formula: [null, []],
    type: [null, []],
    select_option: [null, []],
    is_vertical: [false, []],
    output_type: [null, []],
  });

  constructor(
    protected peDefinitionService: PeDefinitionService,
    protected gfsCodeService: GfsCodeService,
    protected peFormService: PeFormService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService,
    protected enumService: EnumService
  ) {}

  ngOnInit(): void {
    this.peDefinitionService
      .query({ columns: ["id", "field_name"] })
      .subscribe(
        (resp: CustomResponse<PeDefinition[]>) => (this.parents = resp.data)
      );
    this.gfsCodeService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<GfsCode[]>) => (this.gfsCodes = resp.data)
      );
    this.peFormService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<PeForm[]>) => (this.peForms = resp.data)
      );
    this.units = this.enumService.get("units");
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create PeDefinition or Update Facility type if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const peDefinition = this.createFromForm();
    if (peDefinition.id !== undefined) {
      this.subscribeToSaveResponse(
        this.peDefinitionService.update(peDefinition)
      );
    } else {
      this.subscribeToSaveResponse(
        this.peDefinitionService.create(peDefinition)
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<PeDefinition>>
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
   * @param peDefinition
   */
  protected updateForm(peDefinition: PeDefinition): void {
    this.editForm.patchValue({
      id: peDefinition.id,
      field_name: peDefinition.field_name,
      parent_id: peDefinition.parent_id,
      gfs_code_id: peDefinition.gfs_code_id,
      unit: peDefinition.unit,
      is_input: peDefinition.is_input,
      has_breakdown: peDefinition.has_breakdown,
      pe_form_id: peDefinition.pe_form_id,
      is_active: peDefinition.is_active,
      column_number: peDefinition.column_number,
      formula: peDefinition.formula,
      type: peDefinition.type,
      select_option: peDefinition.select_option,
      is_vertical: peDefinition.is_vertical,
      output_type: peDefinition.output_type,
    });
  }

  /**
   * Return form values as object of type PeDefinition
   * @returns PeDefinition
   */
  protected createFromForm(): PeDefinition {
    return {
      ...new PeDefinition(),
      id: this.editForm.get(["id"])!.value,
      field_name: this.editForm.get(["field_name"])!.value,
      parent_id: this.editForm.get(["parent_id"])!.value,
      gfs_code_id: this.editForm.get(["gfs_code_id"])!.value,
      unit: this.editForm.get(["unit"])!.value,
      is_input: this.editForm.get(["is_input"])!.value,
      has_breakdown: this.editForm.get(["has_breakdown"])!.value,
      pe_form_id: this.editForm.get(["pe_form_id"])!.value,
      is_active: this.editForm.get(["is_active"])!.value,
      column_number: this.editForm.get(["column_number"])!.value,
      formula: this.editForm.get(["formula"])!.value,
      type: this.editForm.get(["type"])!.value,
      select_option: this.editForm.get(["select_option"])!.value,
      is_vertical: this.editForm.get(["is_vertical"])!.value,
      output_type: this.editForm.get(["output_type"])!.value,
    };
  }
}