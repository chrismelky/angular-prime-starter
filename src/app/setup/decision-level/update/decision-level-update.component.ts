import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";

import { CustomResponse } from "../../../utils/custom-response";
import { SectionLevel } from "src/app/setup/section-level/section-level.model";
import { SectionLevelService } from "src/app/setup/section-level/section-level.service";
import { DecisionLevel } from "../decision-level.model";
import { DecisionLevelService } from "../decision-level.service";
import { ToastService } from "src/app/shared/toast.service";
import {AdminHierarchyLevel} from "../../admin-hierarchy_level/admin-hierarchy_level.model";
import {AdminHierarchyLevelService} from "../../admin-hierarchy_level/admin-hierarchy_level.service";

@Component({
  selector: "app-decision-level-update",
  templateUrl: "./decision-level-update.component.html",
})
export class DecisionLevelUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  adminHierarchyLevels?: AdminHierarchyLevel[] = [];
  sectionLevels?: SectionLevel[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    name: [null, [Validators.required]],
    admin_hierarchy_position_id: [null, [Validators.required]],
    section_level_id: [null, [Validators.required]],
    next_decision_level_ids: [null, []],
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
      .query()
      .subscribe(
        (resp: CustomResponse<AdminHierarchyLevel[]>) =>
          (this.adminHierarchyLevels = resp.data)
      );
    this.sectionLevelService
      .query()
      .subscribe(
        (resp: CustomResponse<SectionLevel[]>) =>
          (this.sectionLevels = resp.data)
      );
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create DecisionLevel or Update Facility type if exist else set form has error and return
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
      admin_hierarchy_position_id: decisionLevel.admin_hierarchy_position_id,
      section_level_id: decisionLevel.section_level_id,
      next_decision_level_ids: decisionLevel.next_decision_level_ids,
    });
  }

  /**
   * Return form values as object of type DecisionLevel
   * @returns DecisionLevel
   */
  protected createFromForm(): DecisionLevel {
    return {
      ...new DecisionLevel(),
      id: this.editForm.get(["id"])!.value,
      name: this.editForm.get(["name"])!.value,
      admin_hierarchy_position_id: this.editForm.get([
        "admin_hierarchy_position_id",
      ])!.value,
      section_level_id: this.editForm.get(["section_level_id"])!.value,
      next_decision_level_ids: this.editForm.get(["next_decision_level_ids"])!
        .value,
    };
  }
}
