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
import { CeilingChain } from '../ceiling-chain.model';
import { CeilingChainService } from '../ceiling-chain.service';
import { ToastService } from 'src/app/shared/toast.service';
import { AdminHierarchyLevel } from '../../admin-hierarchy-level/admin-hierarchy-level.model';
import { SectionLevel } from '../../section-level/section-level.model';
import { AdminHierarchyLevelService } from '../../admin-hierarchy-level/admin-hierarchy-level.service';
import { SectionLevelService } from '../../section-level/section-level.service';
import { Section } from '../../section/section.model';
import { SectionService } from '../../section/section.service';

@Component({
  selector: 'app-ceiling-chain-update',
  templateUrl: './ceiling-chain-update.component.html',
})
export class CeilingChainUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  forAdminHierarchyLevels?: AdminHierarchyLevel[] = [];
  adminHierarchyLevels?: AdminHierarchyLevel[] = [];
  nexts?: CeilingChain[] = [];
  sectionLevels?: SectionLevel[] = [];
  sections?: Section[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    for_admin_hierarchy_level_position: [null, []],
    admin_hierarchy_level_position: [null, [Validators.required]],
    next_id: [null, []],
    section_level_position: [null, [Validators.required]],
    section: [null, []],
    active: [false, []],
  });

  constructor(
    protected ceilingChainService: CeilingChainService,
    protected adminHierarchyLevelService: AdminHierarchyLevelService,
    protected sectionLevelService: SectionLevelService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    protected sectionService: SectionService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.adminHierarchyLevelService
      .query({ columns: ['id', 'name', 'position'] })
      .subscribe(
        (resp: CustomResponse<AdminHierarchyLevel[]>) =>
          (this.forAdminHierarchyLevels = resp.data)
      );
    this.adminHierarchyLevelService
      .query({ columns: ['id', 'name', 'position'] })
      .subscribe(
        (resp: CustomResponse<AdminHierarchyLevel[]>) =>
          (this.adminHierarchyLevels = resp.data)
      );
    this.ceilingChainService
      .queryWithChild({ page: 1 })
      .subscribe(
        (resp: CustomResponse<CeilingChain[]>) => (this.nexts = resp.data)
      );
    this.sectionLevelService
      .query({ columns: ['id', 'name', 'position'] })
      .subscribe(
        (resp: CustomResponse<SectionLevel[]>) =>
          (this.sectionLevels = resp.data)
      );
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
    if (this.dialogConfig.data.id !== undefined) {
      this.loadSectionByPosition(
        this.dialogConfig.data.section_level_position.position
      );
    }
  }

  /**
   * When form is valid Create CeilingChain or Update if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const ceilingChain = this.createFromForm();
    console.log(ceilingChain);
    if (ceilingChain.id !== undefined) {
      this.subscribeToSaveResponse(
        this.ceilingChainService.update(ceilingChain)
      );
    } else {
      this.subscribeToSaveResponse(
        this.ceilingChainService.create(ceilingChain)
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<CeilingChain>>
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
   * @param ceilingChain
   */
  protected updateForm(ceilingChain: CeilingChain): void {
    this.editForm.patchValue({
      id: ceilingChain.id,
      for_admin_hierarchy_level_position:
        ceilingChain.for_admin_hierarchy_level_position?.position,
      admin_hierarchy_level_position:
        ceilingChain.admin_hierarchy_level_position?.position,
      next_id: ceilingChain.next_id,
      section_level_position: ceilingChain.section_level_position?.position,
      active: ceilingChain.active,
      section:
        ceilingChain!.section !== undefined
          ? ceilingChain!.section.map((c: { id: any }) => c.id)
          : [],
    });
  }

  /**
   * Return form values as object of type CeilingChain
   * @returns CeilingChain
   */
  protected createFromForm(): CeilingChain {
    return {
      ...new CeilingChain(),
      id: this.editForm.get(['id'])!.value,
      for_admin_hierarchy_level_position: this.editForm.get([
        'for_admin_hierarchy_level_position',
      ])!.value,
      admin_hierarchy_level_position: this.editForm.get([
        'admin_hierarchy_level_position',
      ])!.value,
      next_id: this.editForm.get(['next_id'])!.value,
      section_level_position: this.editForm.get(['section_level_position'])!
        .value,
      active: this.editForm.get(['active'])!.value,
      section: this.editForm.get(['section'])!.value,
    };
  }
  loadSectionByPosition(position: number) {
    this.sectionService
      .query({
        position: position,
      })
      .subscribe((res: CustomResponse<Section[]>) => {
        this.sections = res.data ?? [];
      });
  }
}
