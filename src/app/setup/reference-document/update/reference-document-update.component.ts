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
import { AdminHierarchy } from "src/app/setup/admin-hierarchy/admin-hierarchy.model";
import { AdminHierarchyService } from "src/app/setup/admin-hierarchy/admin-hierarchy.service";
import { ReferenceDocumentType } from "src/app/setup/reference-document-type/reference-document-type.model";
import { ReferenceDocumentTypeService } from "src/app/setup/reference-document-type/reference-document-type.service";
import { ReferenceDocument } from "../reference-document.model";
import { ReferenceDocumentService } from "../reference-document.service";
import { ToastService } from "src/app/shared/toast.service";
import {FinancialYear} from "../../financial-year/financial-year.model";
import {FinancialYearService} from "../../financial-year/financial-year.service";

@Component({
  selector: "app-reference-document-update",
  templateUrl: "./reference-document-update.component.html",
})
export class ReferenceDocumentUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  startFinancialYears?: FinancialYear[] = [];
  endFinancialYears?: FinancialYear[] = [];
  adminHierarchies?: AdminHierarchy[] = [];
  referenceDocumentTypes?: ReferenceDocumentType[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    name: [null, []],
    url: [null, []],
    start_financial_year_id: [null, []],
    end_financial_year_id: [null, []],
    admin_hierarchy_id: [null, [Validators.required]],
    reference_document_type_id: [null, [Validators.required]],
  });

  constructor(
    protected referenceDocumentService: ReferenceDocumentService,
    protected financialYearService: FinancialYearService,
    protected adminHierarchyService: AdminHierarchyService,
    protected referenceDocumentTypeService: ReferenceDocumentTypeService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.financialYearService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<FinancialYear[]>) =>
          (this.startFinancialYears = resp.data)
      );
    this.financialYearService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<FinancialYear[]>) =>
          (this.endFinancialYears = resp.data)
      );
    this.adminHierarchyService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<AdminHierarchy[]>) =>
          (this.adminHierarchies = resp.data)
      );
    this.referenceDocumentTypeService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<ReferenceDocumentType[]>) =>
          (this.referenceDocumentTypes = resp.data)
      );
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create ReferenceDocument or Update Facility type if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const referenceDocument = this.createFromForm();
    if (referenceDocument.id !== undefined) {
      this.subscribeToSaveResponse(
        this.referenceDocumentService.update(referenceDocument)
      );
    } else {
      this.subscribeToSaveResponse(
        this.referenceDocumentService.create(referenceDocument)
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<ReferenceDocument>>
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
   * @param referenceDocument
   */
  protected updateForm(referenceDocument: ReferenceDocument): void {
    this.editForm.patchValue({
      id: referenceDocument.id,
      name: referenceDocument.name,
      url: referenceDocument.url,
      start_financial_year_id: referenceDocument.start_financial_year_id,
      end_financial_year_id: referenceDocument.end_financial_year_id,
      admin_hierarchy_id: referenceDocument.admin_hierarchy_id,
      reference_document_type_id: referenceDocument.reference_document_type_id,
    });
  }

  /**
   * Return form values as object of type ReferenceDocument
   * @returns ReferenceDocument
   */
  protected createFromForm(): ReferenceDocument {
    return {
      ...new ReferenceDocument(),
      id: this.editForm.get(["id"])!.value,
      name: this.editForm.get(["name"])!.value,
      url: this.editForm.get(["url"])!.value,
      start_financial_year_id: this.editForm.get(["start_financial_year_id"])!
        .value,
      end_financial_year_id: this.editForm.get(["end_financial_year_id"])!
        .value,
      admin_hierarchy_id: this.editForm.get(["admin_hierarchy_id"])!.value,
      reference_document_type_id: this.editForm.get([
        "reference_document_type_id",
      ])!.value,
    };
  }
}
