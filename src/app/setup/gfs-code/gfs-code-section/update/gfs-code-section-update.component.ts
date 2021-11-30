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

import { CustomResponse } from "../../../../utils/custom-response";
import { GfsCode } from "src/app/setup/gfs-code/gfs-code.model";
import { GfsCodeService } from "src/app/setup/gfs-code/gfs-code.service";
import { Section } from "src/app/setup/section/section.model";
import { SectionService } from "src/app/setup/section/section.service";
import { GfsCodeSection } from "../gfs-code-section.model";
import { GfsCodeSectionService } from "../gfs-code-section.service";
import { ToastService } from "src/app/shared/toast.service";

@Component({
  selector: "app-gfs-code-section-update",
  templateUrl: "./gfs-code-section-update.component.html",
})
export class GfsCodeSectionUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  gfsCode!: GfsCode;
  sections?: Section[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    section_id: [null, [Validators.required]],
  });

  constructor(
    protected gfsCodeSectionService: GfsCodeSectionService,
    protected sectionService: SectionService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {
    this.gfsCode = this.dialogConfig.data.gfsCode;
  }

  ngOnInit(): void {
    this.sectionService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<Section[]>) => (this.sections = resp.data)
      );
    this.updateForm(this.dialogConfig.data.gfsCodeSection); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create GfsCodeSection or Update Facility type if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const gfsCodeSection = this.createFromForm();
    gfsCodeSection.gfs_code_id = this.gfsCode.id;
    if (gfsCodeSection.id !== undefined) {
      this.subscribeToSaveResponse(
        this.gfsCodeSectionService.update(gfsCodeSection)
      );
    } else {
      this.subscribeToSaveResponse(
        this.gfsCodeSectionService.create(gfsCodeSection)
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<GfsCodeSection>>
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
   * @param gfsCodeSection
   */
  protected updateForm(gfsCodeSection: GfsCodeSection): void {
    this.editForm.patchValue({
      id: gfsCodeSection.id,
      section_id: gfsCodeSection.section_id,
    });
  }

  /**
   * Return form values as object of type GfsCodeSection
   * @returns GfsCodeSection
   */
  protected createFromForm(): GfsCodeSection {
    return {
      ...new GfsCodeSection(),
      id: this.editForm.get(["id"])!.value,
      section_id: this.editForm.get(["section_id"])!.value,
    };
  }
}
