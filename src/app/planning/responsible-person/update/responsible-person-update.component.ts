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
import { Section } from "src/app/setup/section/section.model";
import { SectionService } from "src/app/setup/section/section.service";
import { Facility } from "src/app/setup/facility/facility.model";
import { FacilityService } from "src/app/setup/facility/facility.service";
import { ResponsiblePerson } from "../responsible-person.model";
import { ResponsiblePersonService } from "../responsible-person.service";
import { ToastService } from "src/app/shared/toast.service";

@Component({
  selector: "app-responsible-person-update",
  templateUrl: "./responsible-person-update.component.html",
})
export class ResponsiblePersonUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  adminHierarchies?: AdminHierarchy[] = [];
  sections?: Section[] = [];
  facilities?: Facility[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    name: [null, [Validators.required]],
    mobile: [null, [Validators.required]],
    email: [null, []],
    cheque_number: [null, [Validators.required]],
    title: [null, [Validators.required]],
    admin_hierarchy_id: [null, [Validators.required]],
    section_id: [null, [Validators.required]],
    facility_id: [null, [Validators.required]],
    is_active: [false, []],
  });

  constructor(
    protected responsiblePersonService: ResponsiblePersonService,
    protected adminHierarchyService: AdminHierarchyService,
    protected sectionService: SectionService,
    protected facilityService: FacilityService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.adminHierarchyService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<AdminHierarchy[]>) =>
          (this.adminHierarchies = resp.data)
      );
    this.sectionService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<Section[]>) => (this.sections = resp.data)
      );
    this.facilityService
      .query({ columns: ["id", "name"] })
      .subscribe(
        (resp: CustomResponse<Facility[]>) => (this.facilities = resp.data)
      );
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create ResponsiblePerson or Update Facility type if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const responsiblePerson = this.createFromForm();
    if (responsiblePerson.id !== undefined) {
      this.subscribeToSaveResponse(
        this.responsiblePersonService.update(responsiblePerson)
      );
    } else {
      this.subscribeToSaveResponse(
        this.responsiblePersonService.create(responsiblePerson)
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<ResponsiblePerson>>
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
   * @param responsiblePerson
   */
  protected updateForm(responsiblePerson: ResponsiblePerson): void {
    this.editForm.patchValue({
      id: responsiblePerson.id,
      name: responsiblePerson.name,
      mobile: responsiblePerson.mobile,
      email: responsiblePerson.email,
      cheque_number: responsiblePerson.cheque_number,
      title: responsiblePerson.title,
      admin_hierarchy_id: responsiblePerson.admin_hierarchy_id,
      section_id: responsiblePerson.section_id,
      facility_id: responsiblePerson.facility_id,
      is_active: responsiblePerson.is_active,
    });
  }

  /**
   * Return form values as object of type ResponsiblePerson
   * @returns ResponsiblePerson
   */
  protected createFromForm(): ResponsiblePerson {
    return {
      ...new ResponsiblePerson(),
      id: this.editForm.get(["id"])!.value,
      name: this.editForm.get(["name"])!.value,
      mobile: this.editForm.get(["mobile"])!.value,
      email: this.editForm.get(["email"])!.value,
      cheque_number: this.editForm.get(["cheque_number"])!.value,
      title: this.editForm.get(["title"])!.value,
      admin_hierarchy_id: this.editForm.get(["admin_hierarchy_id"])!.value,
      section_id: this.editForm.get(["section_id"])!.value,
      facility_id: this.editForm.get(["facility_id"])!.value,
      is_active: this.editForm.get(["is_active"])!.value,
    };
  }
}
