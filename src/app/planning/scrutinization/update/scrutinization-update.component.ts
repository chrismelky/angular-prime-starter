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
import { AdminHierarchy } from 'src/app/setup/admin-hierarchy/admin-hierarchy.model';
import { AdminHierarchyService } from 'src/app/setup/admin-hierarchy/admin-hierarchy.service';
import { Section } from 'src/app/setup/section/section.model';
import { SectionService } from 'src/app/setup/section/section.service';
import { Scrutinization } from '../scrutinization.model';
import { ScrutinizationService } from '../scrutinization.service';
import { ToastService } from 'src/app/shared/toast.service';
import {User} from "../../../setup/user/user.model";
import {UserService} from "../../../setup/user/user.service";

@Component({
  selector: 'app-scrutinization-update',
  templateUrl: './scrutinization-update.component.html',
})
export class ScrutinizationUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];
  currentUser!: User;
  adminHierarchies?: AdminHierarchy[] = [];
  sections?: Section[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    admin_hierarchy_id: [null, [Validators.required]],
    section_id: [null, [Validators.required]],
    comments: [null, [Validators.required]],
  });

  constructor(
    protected userService: UserService,
    protected scrutinizationService: ScrutinizationService,
    protected adminHierarchyService: AdminHierarchyService,
    protected sectionService: SectionService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {
    this.currentUser = userService.getCurrentUser();
  }

  ngOnInit(): void {
    this.sectionService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<Section[]>) => (this.sections = resp.data)
      );
    this.sectionService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<Section[]>) => (this.sections = resp.data)
      );
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create Scrutinization or Update Facility type if exist else set form has error and return
   * @returns
   */
  save(): void {
    let data = {
      admin_hierarchy_level_id:this.currentUser.admin_hierarchy?.admin_hierarchy_position,
      financial_year_id:this.dialogConfig.data.financial_year_id,
      comments:this.editForm.value.comments,
      activity_id:this.dialogConfig.data.id
    }
    console.log(data)
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const scrutinization = this.createFromForm();
    if (scrutinization.id !== undefined) {
      this.subscribeToSaveResponse(
        this.scrutinizationService.update(scrutinization)
      );
    } else {
      this.subscribeToSaveResponse(
        this.scrutinizationService.create(scrutinization)
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<Scrutinization>>
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
   * @param scrutinization
   */
  protected updateForm(scrutinization: Scrutinization): void {
    this.editForm.patchValue({
      id: scrutinization.id,
      admin_hierarchy_id: scrutinization.admin_hierarchy_id,
      section_id: scrutinization.section_id,
      comments: scrutinization.comments,
    });
  }

  /**
   * Return form values as object of type Scrutinization
   * @returns Scrutinization
   */
  protected createFromForm(): Scrutinization {
    return {
      ...new Scrutinization(),
      id: this.editForm.get(['id'])!.value,
      admin_hierarchy_id: this.editForm.get(['admin_hierarchy_id'])!.value,
      section_id: this.editForm.get(['section_id'])!.value,
      comments: this.editForm.get(['comments'])!.value,
    };
  }
}
