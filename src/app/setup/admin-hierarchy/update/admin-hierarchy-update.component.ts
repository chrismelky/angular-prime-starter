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
import { AdminHierarchy } from '../admin-hierarchy.model';
import { AdminHierarchyService } from '../admin-hierarchy.service';
import { ToastService } from 'src/app/shared/toast.service';
import { AdminHierarchyLevel } from '../../admin-hierarchy-level/admin-hierarchy-level.model';
import { DecisionLevel } from '../../decision-level/decision-level.model';
import { AdminHierarchyLevelService } from '../../admin-hierarchy-level/admin-hierarchy-level.service';
import { DecisionLevelService } from '../../decision-level/decision-level.service';

@Component({
  selector: 'app-admin-hierarchy-update',
  templateUrl: './admin-hierarchy-update.component.html',
})
export class AdminHierarchyUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  parents?: AdminHierarchy[] = [];
  adminHierarchyPositions?: AdminHierarchyLevel[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    name: [null, [Validators.required]],
    code: [null, [Validators.required]],
    parent_id: [{ value: null, disabled: true }, [Validators.required]],
    admin_hierarchy_position: [
      { value: null, disabled: true },
      [Validators.required],
    ],
    current_budget_locked: [false, [Validators.required]],
    is_carryover_budget_locked: [false, [Validators.required]],
    is_supplementary_budget_locked: [false, [Validators.required]],
    is_current_budget_approved: [false, [Validators.required]],
    is_carryover_budget_approved: [false, [Validators.required]],
    is_supplementary_budget_approved: [false, [Validators.required]],
    current_budget_decision_level_id: [null, []],
    carryover_budget_decision_level_id: [null, []],
    supplementary_budget_decision_level_id: [null, []],
  });

  constructor(
    protected adminHierarchyService: AdminHierarchyService,
    protected adminHierarchyLevelService: AdminHierarchyLevelService,
    protected decisionLevelService: DecisionLevelService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.adminHierarchyLevelService
      .query()
      .subscribe(
        (resp: CustomResponse<AdminHierarchyLevel[]>) =>
          (this.adminHierarchyPositions = resp.data)
      );
    const data: AdminHierarchy = this.dialogConfig.data;
    this.parents?.push(data.parent!);
    this.updateForm(data); //Initialize form with data from dialog
  }


  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const adminHierarchy = this.createFromForm();
    if (adminHierarchy.id !== undefined) {
      this.subscribeToSaveResponse(
        this.adminHierarchyService.update(adminHierarchy)
      );
    } else {
      this.subscribeToSaveResponse(
        this.adminHierarchyService.create(adminHierarchy)
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<AdminHierarchy>>
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
   * @param adminHierarchy
   */
  protected updateForm(adminHierarchy: AdminHierarchy): void {
    this.editForm.patchValue({
      id: adminHierarchy.id,
      name: adminHierarchy.name,
      code: adminHierarchy.code,
      parent_id: adminHierarchy.parent_id,
      admin_hierarchy_position: adminHierarchy.admin_hierarchy_position,
      current_budget_locked: adminHierarchy.current_budget_locked
        ? adminHierarchy.current_budget_locked
        : false,
      is_carryover_budget_locked: adminHierarchy.is_carryover_budget_locked
        ? adminHierarchy.is_carryover_budget_locked
        : false,
      is_supplementary_budget_locked:
        adminHierarchy.is_supplementary_budget_locked
          ? adminHierarchy.is_supplementary_budget_locked
          : false,
      is_current_budget_approved: adminHierarchy.is_current_budget_approved
        ? adminHierarchy.is_current_budget_approved
        : false,
      is_carryover_budget_approved: adminHierarchy.is_carryover_budget_approved
        ? adminHierarchy.is_carryover_budget_approved
        : false,
      is_supplementary_budget_approved:
        adminHierarchy.is_supplementary_budget_approved
          ? adminHierarchy.is_supplementary_budget_approved
          : false,
      current_budget_decision_level_id:
        adminHierarchy.current_budget_decision_level_id,
      carryover_budget_decision_level_id:
        adminHierarchy.carryover_budget_decision_level_id,
      supplementary_budget_decision_level_id:
        adminHierarchy.supplementary_budget_decision_level_id,
    });
  }

  /**
   * Return form values as object of type AdminHierarchy
   * @returns AdminHierarchy
   */
  protected createFromForm(): AdminHierarchy {
    return {
      ...new AdminHierarchy(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      code: this.editForm.get(['code'])!.value,
      parent_id: this.editForm.get(['parent_id'])!.value,
      admin_hierarchy_position: this.editForm.get(['admin_hierarchy_position'])!
        .value,
      current_budget_locked: this.editForm.get(['current_budget_locked'])!
        .value,
      is_carryover_budget_locked: this.editForm.get([
        'is_carryover_budget_locked',
      ])!.value,
      is_supplementary_budget_locked: this.editForm.get([
        'is_supplementary_budget_locked',
      ])!.value,
      is_current_budget_approved: this.editForm.get([
        'is_current_budget_approved',
      ])!.value,
      is_carryover_budget_approved: this.editForm.get([
        'is_carryover_budget_approved',
      ])!.value,
      is_supplementary_budget_approved: this.editForm.get([
        'is_supplementary_budget_approved',
      ])!.value,
      current_budget_decision_level_id: this.editForm.get([
        'current_budget_decision_level_id',
      ])!.value,
      carryover_budget_decision_level_id: this.editForm.get([
        'carryover_budget_decision_level_id',
      ])!.value,
      supplementary_budget_decision_level_id: this.editForm.get([
        'supplementary_budget_decision_level_id',
      ])!.value,
    };
  }
}
