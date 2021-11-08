/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { CustomResponse } from '../../../utils/custom-response';
import { Section } from 'src/app/setup/section/section.model';
import { SectionService } from 'src/app/setup/section/section.service';
import { AdminHierarchy } from 'src/app/setup/admin-hierarchy/admin-hierarchy.model';
import { User } from '../user.model';
import { UserService } from '../user.service';
import { ToastService } from 'src/app/shared/toast.service';
import { Facility } from '../../facility/facility.model';
import { FacilityService } from '../../facility/facility.service';
import { Role } from '../../role/role.model';
import { RoleService } from '../../role/role.service';
import { SectionLevelService } from '../../section-level/section-level.service';
import { SectionLevel } from '../../section-level/section-level.model';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
})
export class UserUpdateComponent implements OnInit {
  isSaving = false;
  facilityIsLoading = false;
  roleIsLoading = false;
  sectionIsLoading = false;

  formError = false;
  errors = [];
  sectionLevels?: SectionLevel[] = [];
  sections?: Section[] = [];
  adminHierarchies?: AdminHierarchy[] = [];
  roles?: Role[] = [];
  facilities?: any[] = [];
  adminHierarchy: AdminHierarchy = {};

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    first_name: [null, [Validators.required]],
    last_name: [null, [Validators.required]],
    username: [null, [Validators.required]],
    email: [null, [Validators.required, Validators.email]],
    cheque_number: [null, [Validators.required]],
    active: [false, []],
    title: [null, []],
    mobile_number: [null, []],
    section_id: [null, [Validators.required]],
    section_position: [null, [Validators.required]],
    admin_hierarchy_id: [null, [Validators.required]],
    facilities: [null, []],
    role_id: [null, []],
    is_facility_user: [null, []],
    has_facility_limit: [null, []],
    facility_id: [null, []],
    is_super_user: [false, []],
  });

  constructor(
    protected userService: UserService,
    protected sectionService: SectionService,
    protected sectionLevelService: SectionLevelService,
    protected roleService: RoleService,
    protected facilityService: FacilityService,
    protected fb: FormBuilder,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.sectionLevelService
      .query({
        columns: ['id', 'name', 'code', 'position'],
        sort: ['position:asc'],
      })
      .subscribe(
        (resp: CustomResponse<SectionLevel[]>) =>
          (this.sectionLevels = resp.data)
      );

    const dialogData = this.dialogConfig.data;

    const user: User = dialogData.user;

    this.adminHierarchy = dialogData.adminHierarchy;

    this.adminHierarchies = [this.adminHierarchy];

    this.loadRoleByAdminLevel(
      dialogData.adminHierarchy.admin_hierarchy_position
    );

    // load section if user has id i.e edit user
    user?.id && this.loadSections(user.section_position!);

    this.updateForm(user);

    // load facilities if user has id i.e edit user
    user?.id && this.loadFacilities();
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
    if (user.id === undefined) {
      this.subscribeToSaveResponse(this.userService.create(user));
    } else {
      this.subscribeToSaveResponse(this.userService.update(user));
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

  close() {
    this.dialogRef.close();
  }

  /**
   * When save successfully close dialog and display info message
   * @param result
   */
  protected onSaveSuccess(result: any): void {
    this.toastService.info(result.message);
    this.dialogRef.close(result);
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
      id: user?.id,
      first_name: user?.first_name,
      last_name: user?.last_name,
      email: user?.email,
      cheque_number: user?.cheque_number,
      active: user?.active,
      title: user?.title,
      mobile_number: user?.mobile_number,
      section_id: user?.section_id,
      section_position: user?.section_position,
      username: user?.username,
      admin_hierarchy_id: user?.admin_hierarchy_id,
      role_id: user?.roles?.length ? user?.roles[0].id : null,
      facilities:
        user?.facilities !== undefined
          ? JSON.parse(user.facilities!)
          : user?.facilities,
      is_facility_user: user?.is_facility_user,
      facility_id: user?.facility_id,
      is_super_user: user?.is_super_user,
      has_facility_limit: user?.has_facility_limit,
    });
  }

  /**
   * Return form values as object of type User
   * @returns User
   */
  protected createFromForm(): User {
    return {
      ...new User(),
      ...this.editForm.value,
      roles: [{ id: this.editForm.get('role_id')?.value }],
      facilities:
        this.editForm.get(['facilities'])!.value !== undefined
          ? JSON.stringify(this.editForm.get(['facilities'])!.value)
          : undefined,
    };
  }

  loadRoleByAdminLevel(adminHierarchyPosition: number): void {
    this.roleIsLoading = true;
    this.roleService
      .query({
        columns: ['id', 'name'],
        admin_hierarchy_position: adminHierarchyPosition,
      })
      .subscribe(
        (resp: CustomResponse<Role[]>) => {
          this.roles = resp.data;
          this.roleIsLoading = false;
        },
        (error) => (this.roleIsLoading = false)
      );
  }

  isFacilityUserChanged(): void {
    // If is facility user
    const isFacilityUser = this.editForm.get('is_facility_user')?.value;

    if (isFacilityUser) {
      this.editForm.get('facility_id')?.setValidators([Validators.required]);
      this.editForm.patchValue({
        has_facility_limit: true,
        facilities: [],
      });
      this.editForm.get('facilities')?.clearValidators();
      this.loadFacilities();
    } else {
      this.editForm.get('facility_id')?.clearValidators();
      this.editForm.patchValue({
        has_facility_limit: false,
        facilities: [],
      });
    }
    this.editForm.get('facility_id')?.updateValueAndValidity();
    this.editForm.get('facilities')?.updateValueAndValidity();
  }

  hasFacilityLimitChanged(): void {
    const hasLimit = this.editForm.get('has_facility_limit')?.value;
    if (hasLimit) {
      this.editForm.get('facilities')?.setValidators([Validators.required]);
      this.loadFacilities();
    } else {
      this.editForm.get('facilities')?.clearValidators();
      this.editForm.get('facility_id')?.clearValidators();
      this.editForm.patchValue({
        facilities: [],
        facility_id: null,
        is_facility_user: false,
      });
    }
    this.editForm.get('facilities')?.updateValueAndValidity();
    this.editForm.get('facility_id')?.updateValueAndValidity();
  }

  /**
   * Load section by setionlevel
   * @param sectionLevelId
   */
  loadSections(position: number): void {
    this.sectionIsLoading = true;
    this.sectionService
      .query({
        columns: ['id', 'name', 'code'],
        sort: ['name:asc'],
        position: position,
      })
      .subscribe(
        (resp: CustomResponse<Section[]>) => {
          this.sections = resp.data;
          this.sectionIsLoading = false;
        },
        (error) => (this.sectionIsLoading = false)
      );
  }

  /**
   * Load facilities by section and admin hiearchy
   */
  loadFacilities(): void {
    const sectionId = this.editForm.get('section_id')?.value as number;
    const hasFacilityLimit = this.editForm.get('has_facility_limit')?.value;
    const isFacilityUser = this.editForm.get('is_facility_user')?.value;
    const parentName = 'p' + this.adminHierarchy?.admin_hierarchy_position;
    const parentId = this.adminHierarchy?.id;
    if (
      sectionId != null &&
      parentId != null &&
      (isFacilityUser || hasFacilityLimit)
    ) {
      this.facilityIsLoading = true;
      this.facilityService.planning(parentName, parentId, sectionId).subscribe(
        (resp: CustomResponse<Facility[]>) => {
          this.facilities = resp.data;
          this.facilityIsLoading = false;
        },
        (error) => (this.facilityIsLoading = false)
      );
    }
  }
}
