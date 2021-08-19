import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";

import { CustomResponse } from "../../../utils/custom-response";
import { AdminHierarchyLevel } from "../admin-hierarchy_level.model";
import { AdminHierarchyLevelService } from "../admin-hierarchy_level.service";
import { ToastService } from "src/app/shared/toast.service";

@Component({
  selector: "app-admin-hierarchy_level-update",
  templateUrl: "./admin-hierarchy_level-update.component.html",
})
export class AdminHierarchyLevelUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    code: [null, [Validators.required]],
    name: [null, [Validators.required]],
    position: [null, [Validators.required]],
    code_required: [null, []],
    code_length: [null, []],
  });

  constructor(
    protected adminhierarchy_levelService: AdminHierarchyLevelService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.updateForm(this.dialogConfig.data); //Initilize form with data from dialog
  }

  /**
   * When form is valid Create AdminHierarchyLevel or Update Facilitiy type if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const adminhierarchy_level = this.createFromForm();
    if (adminhierarchy_level.id !== undefined) {
      this.subscribeToSaveResponse(
        this.adminhierarchy_levelService.update(adminhierarchy_level)
      );
    } else {
      this.subscribeToSaveResponse(
        this.adminhierarchy_levelService.create(adminhierarchy_level)
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<AdminHierarchyLevel>>
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
   * @param adminhierarchy_level
   */
  protected updateForm(adminhierarchy_level: AdminHierarchyLevel): void {
    this.editForm.patchValue({
      id: adminhierarchy_level.id,
      code: adminhierarchy_level.code,
      name: adminhierarchy_level.name,
      position: adminhierarchy_level.position,
      code_required: adminhierarchy_level.code_required,
      code_length: adminhierarchy_level.code_length,
    });
  }

  /**
   * Return form values as object of type AdminHierarchyLevel
   * @returns AdminHierarchyLevel
   */
  protected createFromForm(): AdminHierarchyLevel {
    return {
      ...new AdminHierarchyLevel(),
      id: this.editForm.get(["id"])!.value,
      code: this.editForm.get(["code"])!.value,
      name: this.editForm.get(["name"])!.value,
      position: this.editForm.get(["position"])!.value,
      code_required: this.editForm.get(["code_required"])!.value,
      code_length: this.editForm.get(["code_length"])!.value,
    };
  }
}
