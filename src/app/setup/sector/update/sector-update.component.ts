import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";

import { CustomResponse } from "../../../utils/custom-response";
import { Sector } from "../sector.model";
import { SectorService } from "../sector.service";
import { ToastService } from "src/app/shared/toast.service";

@Component({
  selector: "app-sector-update",
  templateUrl: "./sector-update.component.html",
})
export class SectorUpdateComponent implements OnInit {
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
    description: [null, []],
  });

  constructor(
    protected sectorService: SectorService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.updateForm(this.dialogConfig.data); //Initilize form with data from dialog
  }

  /**
   * When form is valid Create Sector or Update Facilitiy type if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const sector = this.createFromForm();
    if (sector.id !== undefined) {
      this.subscribeToSaveResponse(this.sectorService.update(sector));
    } else {
      this.subscribeToSaveResponse(this.sectorService.create(sector));
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<Sector>>
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
   * @param sector
   */
  protected updateForm(sector: Sector): void {
    this.editForm.patchValue({
      id: sector.id,
      code: sector.code,
      name: sector.name,
      description: sector.description,
    });
  }

  /**
   * Return form values as object of type Sector
   * @returns Sector
   */
  protected createFromForm(): Sector {
    return {
      ...new Sector(),
      id: this.editForm.get(["id"])!.value,
      code: this.editForm.get(["code"])!.value,
      name: this.editForm.get(["name"])!.value,
      description: this.editForm.get(["description"])!.value,
    };
  }
}
