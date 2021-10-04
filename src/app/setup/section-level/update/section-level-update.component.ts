import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { CustomResponse } from '../../../utils/custom-response';
import { SectionLevel } from '../section-level.model';
import { SectionLevelService } from '../section-level.service';
import { ToastService } from 'src/app/shared/toast.service';

@Component({
  selector: 'app-section-level-update',
  templateUrl: './section-level-update.component.html',
})
export class SectionLevelUpdateComponent implements OnInit {
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
    is_cost_centre: [null, []],
    code_length: [null, []],
  });

  constructor(
    protected sectionLevelService: SectionLevelService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.updateForm(this.dialogConfig.data); //Initilize form with data from dialog
  }

  /**
   * When form is valid Create SectionLevel or Update Facilitiy type if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const sectionLevel = this.createFromForm();
    if (sectionLevel.id !== undefined) {
      this.subscribeToSaveResponse(
        this.sectionLevelService.update(sectionLevel)
      );
    } else {
      this.subscribeToSaveResponse(
        this.sectionLevelService.create(sectionLevel)
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<SectionLevel>>
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
   * @param sectionLevel
   */
  protected updateForm(sectionLevel: SectionLevel): void {
    this.editForm.patchValue({
      id: sectionLevel.id,
      code: sectionLevel.code,
      name: sectionLevel.name,
      position: sectionLevel.position,
      code_required: sectionLevel.code_required,
      is_cost_centre: sectionLevel.is_cost_centre,
      code_length: sectionLevel.code_length,
    });
  }

  /**
   * Return form values as object of type SectionLevel
   * @returns SectionLevel
   */
  protected createFromForm(): SectionLevel {
    return {
      ...new SectionLevel(),
      id: this.editForm.get(['id'])!.value,
      code: this.editForm.get(['code'])!.value,
      name: this.editForm.get(['name'])!.value,
      position: this.editForm.get(['position'])!.value,
      code_required: this.editForm.get(['code_required'])!.value,
      is_cost_centre: this.editForm.get(['is_cost_centre'])!.value,
      code_length: this.editForm.get(['code_length'])!.value,
    };
  }
}
