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
import { AdminHierarchyLevel } from 'src/app/setup/admin-hierarchy-level/admin-hierarchy-level.model';
import { AdminHierarchyLevelService } from 'src/app/setup/admin-hierarchy-level/admin-hierarchy-level.service';
import { SectionLevel } from 'src/app/setup/section-level/section-level.model';
import { SectionLevelService } from 'src/app/setup/section-level/section-level.service';
import { DecisionLevel } from '../decision-level.model';
import { DecisionLevelService } from '../decision-level.service';
import { ToastService } from 'src/app/shared/toast.service';

@Component({
  selector: 'app-decision-level-update',
  templateUrl: './decision-level-update.component.html',
})
export class DecisionLevelUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  adminHierarchyLevels?: AdminHierarchyLevel[] = [];
  sectionLevels?: SectionLevel[] = [];
  nextDecisionLevels?: DecisionLevel[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    name: [null, [Validators.required]],
    admin_hierarchy_level_position: [null, [Validators.required]],
    section_level_position: [null, [Validators.required]],
    next_decision_level_id: [null, []],
  });

  constructor(
    protected decisionLevelService: DecisionLevelService,
    protected adminHierarchyLevelService: AdminHierarchyLevelService,
    protected sectionLevelService: SectionLevelService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.adminHierarchyLevelService
      .query({
        columns: ['id', 'name', 'position'],
      })
      .subscribe(
        (resp: CustomResponse<AdminHierarchyLevel[]>) =>
          (this.adminHierarchyLevels = resp.data)
      );
    this.sectionLevelService
      .query({
        columns: ['id', 'name', 'position'],
      })
      .subscribe(
        (resp: CustomResponse<SectionLevel[]>) =>
          (this.sectionLevels = resp.data)
      );
    this.decisionLevelService
      .query({
        columns: ['id', 'name'],
      })
      .subscribe(
        (resp: CustomResponse<DecisionLevel[]>) =>
          (this.nextDecisionLevels = resp.data)
      );
    this.updateForm(this.dialogConfig.data); //Initilize form with data from dialog
  }

  /**
   * When form is valid Create DecisionLevel or Update Facilitiy type if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const decisionLevel = this.createFromForm();
    if (decisionLevel.id !== undefined) {
      this.subscribeToSaveResponse(
        this.decisionLevelService.update(decisionLevel)
      );
    } else {
      this.subscribeToSaveResponse(
        this.decisionLevelService.create(decisionLevel)
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<DecisionLevel>>
  ): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      (result) => this.onSaveSuccess(result),
      (error) => this.onSaveError(error)
    );
  }

  /**
   * When save successfully close dialog and dispaly info message
   * @param result
   */
  protected onSaveSuccess(result: any): void {
    this.toastService.info(result.message);
    this.dialogRef.close(true);
  }

  /**
   * Error handiling specific to this component
   * Note; general error handleing is done by ErrorInterceptor
   * @param error
   */
  protected onSaveError(error: any): void {}

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  /**
   * Set/Initialize form values
   * @param decisionLevel
   */
  protected updateForm(decisionLevel: DecisionLevel): void {
    this.editForm.patchValue({
      id: decisionLevel.id,
      name: decisionLevel.name,
      admin_hierarchy_level_position:
        decisionLevel.admin_hierarchy_level_position,
      section_level_position: decisionLevel.section_level_position,
      next_decision_level_id: decisionLevel.next_decision_level_id,
    });
  }

  /**
   * Return form values as object of type DecisionLevel
   * @returns DecisionLevel
   */
  protected createFromForm(): DecisionLevel {
    return {
      ...new DecisionLevel(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      admin_hierarchy_level_position: this.editForm.get([
        'admin_hierarchy_level_position',
      ])!.value,
      section_level_position: this.editForm.get(['section_level_position'])!
        .value,
      next_decision_level_id: this.editForm.get(['next_decision_level_id'])!
        .value,
    };
  }
}
