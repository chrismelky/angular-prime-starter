/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { CustomResponse } from '../../../utils/custom-response';
import { Section } from 'src/app/setup/section/section.model';
import { SectionService } from 'src/app/setup/section/section.service';
import { AdminHierarchy } from 'src/app/setup/admin-hierarchy/admin-hierarchy.model';
import { AdminHierarchyService } from 'src/app/setup/admin-hierarchy/admin-hierarchy.service';
// import { Facility } from 'src/app/setup/facility/facility.model';
// import { FacilityService } from 'src/app/setup/facility/facility.service';
import { User } from '../user.model';
import { UserService } from '../user.service';
import { ToastService } from 'src/app/shared/toast.service';

@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
})
export class UserUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  sections?: Section[] = [];
  adminHierarchies?: AdminHierarchy[] = [];
  facilities?: any[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    first_name: [null, [Validators.required]],
    last_name: [null, [Validators.required]],
    email: [null, [Validators.required]],
    cheque_number: [null, [Validators.required]],
    activated: [false, []],
    title: [null, []],
    mobile_number: [null, []],
    section_id: [null, []],
    admin_hierarchy_id: [null, [Validators.required]],
    facilities: [null, []],
    is_facility_user: [false, []],
    is_super_user: [false, []],
  });

  constructor(
    protected userService: UserService,
    protected sectionService: SectionService,
    protected adminHierarchyService: AdminHierarchyService,
    // protected facilityService: FacilityService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.sectionService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<Section[]>) => (this.sections = resp.data)
      );
    this.adminHierarchyService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<AdminHierarchy[]>) =>
          (this.adminHierarchies = resp.data)
      );
    // this.facilityService
    //   .query({ columns: ['id', 'name'] })
    //   .subscribe(
    //     (resp: CustomResponse<Facility[]>) => (this.facilities = resp.data)
    //   );
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create User Update if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const user = this.createFromForm();
    if (user.id !== undefined) {
      this.subscribeToSaveResponse(this.userService.update(user));
    } else {
      this.subscribeToSaveResponse(this.userService.create(user));
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<User>>
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
   * @param user
   */
  protected updateForm(user: User): void {
    this.editForm.patchValue({
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      cheque_number: user.cheque_number,
      activated: user.activated,
      title: user.title,
      mobile_number: user.mobile_number,
      section_id: user.section_id,
      admin_hierarchy_id: user.admin_hierarchy_id,
      facilities:
        user.facilities !== undefined
          ? JSON.parse(user.facilities!)
          : user.facilities,
      is_facility_user: user.is_facility_user,
      is_super_user: user.is_super_user,
    });
  }

  /**
   * Return form values as object of type User
   * @returns User
   */
  protected createFromForm(): User {
    return {
      ...new User(),
      id: this.editForm.get(['id'])!.value,
      first_name: this.editForm.get(['first_name'])!.value,
      last_name: this.editForm.get(['last_name'])!.value,
      email: this.editForm.get(['email'])!.value,
      cheque_number: this.editForm.get(['cheque_number'])!.value,
      activated: this.editForm.get(['activated'])!.value,
      title: this.editForm.get(['title'])!.value,
      mobile_number: this.editForm.get(['mobile_number'])!.value,
      section_id: this.editForm.get(['section_id'])!.value,
      admin_hierarchy_id: this.editForm.get(['admin_hierarchy_id'])!.value,
      facilities:
        this.editForm.get(['facilities'])!.value !== undefined
          ? JSON.stringify(this.editForm.get(['facilities'])!.value)
          : undefined,
      is_facility_user: this.editForm.get(['is_facility_user'])!.value,
      is_super_user: this.editForm.get(['is_super_user'])!.value,
    };
  }
}