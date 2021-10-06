/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {finalize} from 'rxjs/operators';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';

import {CustomResponse} from '../../../utils/custom-response';
import {EnumService, PlanrepEnum} from 'src/app/shared/enum.service';
import {FacilityType} from 'src/app/setup/facility-type/facility-type.model';
import {FacilityTypeService} from 'src/app/setup/facility-type/facility-type.service';
import {AdminHierarchy} from 'src/app/setup/admin-hierarchy/admin-hierarchy.model';
import {AdminHierarchyService} from 'src/app/setup/admin-hierarchy/admin-hierarchy.service';
import {Facility} from '../facility.model';
import {FacilityService} from '../facility.service';
import {ToastService} from 'src/app/shared/toast.service';

@Component({
  selector: 'app-facility-update',
  templateUrl: './facility-update.component.html',
})
export class FacilityUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];
  adminHierarchies?: AdminHierarchy[] = [];
  ownerships?: PlanrepEnum[] = [];
  physicalStates?: PlanrepEnum[] = [];
  starRatings?: PlanrepEnum[] = [];
  facilityTypes?: FacilityType[] = [];
  facility: Facility = {};

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    code: [null, [Validators.required]],
    name: [null, [Validators.required]],
    facility_type_id: [null, [Validators.required]],
    admin_hierarchy_id: [null, [Validators.required]],
    ownership: [null, [Validators.required]],
    physical_state: [null, [Validators.required]],
    star_rating: [null, [Validators.required]],
  });

  constructor(
    protected facilityService: FacilityService,
    protected facilityTypeService: FacilityTypeService,
    protected adminHierarchyService: AdminHierarchyService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService,
    protected enumService: EnumService
  ) {
    if(this.dialogConfig.data.facility !== undefined){
      const facility = this.dialogConfig.data.facility as Facility;
      facility.facility_type_id = this.dialogConfig.data.facility_type_id;
      facility.admin_hierarchy_id = this.dialogConfig.data.admin_hierarchy_id;
      this.facility = facility;
    } else{
      this.facility.facility_type_id = this.dialogConfig.data.facility_type_id;
      this.facility.admin_hierarchy_id = this.dialogConfig.data.admin_hierarchy_id;
    }
    this.facilityTypes = this.dialogConfig.data.facilityTypes;
  }

  ngOnInit(): void {
    this.ownerships = this.enumService.get('ownerships');
    this.physicalStates = this.enumService.get('physicalStates');
    this.starRatings = this.enumService.get('starRatings');
    this.updateForm(this.facility); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create Facility or Update Facility type if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const facility = this.createFromForm();
    if (facility.id !== undefined) {
      this.subscribeToSaveResponse(this.facilityService.update(facility));
    } else {
      this.subscribeToSaveResponse(this.facilityService.create(facility));
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<Facility>>
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
   * @param facility
   */
  protected updateForm(facility: Facility): void {
    this.editForm.patchValue({
      id: facility.id,
      code: facility.code,
      name: facility.name,
      facility_type_id: facility.facility_type_id,
      admin_hierarchy_id: facility.admin_hierarchy_id,
      ownership: facility.ownership,
      physical_state: facility.physical_state,
      star_rating: facility.star_rating,
    });
  }

  /**
   * Return form values as object of type Facility
   * @returns Facility
   */
  protected createFromForm(): Facility {
    return {
      ...new Facility(),
      id: this.editForm.get(['id'])!.value,
      code: this.editForm.get(['code'])!.value,
      name: this.editForm.get(['name'])!.value,
      facility_type_id: this.editForm.get(['facility_type_id'])!.value,
      admin_hierarchy_id: this.editForm.get(['admin_hierarchy_id'])!.value,
      ownership: this.editForm.get(['ownership'])!.value,
      physical_state: this.editForm.get(['physical_state'])!.value,
      star_rating: this.editForm.get(['star_rating'])!.value,
    };
  }

  onAdminHierarchySelection(adminHierarchy: AdminHierarchy): void {
    this.editForm.get('admin_hierarchy_id')?.setValue(adminHierarchy.id);
  }
}
