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
import { Advertisement } from '../advertisement.model';
import { AdvertisementService } from '../advertisement.service';
import { ToastService } from 'src/app/shared/toast.service';

@Component({
  selector: 'app-advertisement-update',
  templateUrl: './advertisement-update.component.html',
})
export class AdvertisementUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];
  uploadedFiles: any[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    description: [null, []],
    status: [false, [Validators.required]],
    start_date: [null, [Validators.required]],
    end_date: [null, [Validators.required]],
    ad_url: [null, [Validators.required]],
  });

  constructor(
    protected advertisementService: AdvertisementService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
    console.log(this.dialogConfig.data);
  }

  /**
   * When form is valid Create Advertisement or Update if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }

    this.isSaving = true;
    const advertisement = this.createFromForm();
    if (advertisement.id !== undefined) {
      this.subscribeToSaveResponse(
        this.advertisementService.update(advertisement)
      );
    } else {
      this.subscribeToSaveResponse(
        this.advertisementService.create(advertisement)
      );
    }
  }

  onSelect(event: any) {
    this.uploadedFiles = [];
    for (let file of event.files) {
      const reader = new FileReader();
      reader.onload = this.handleReaderLoaded.bind(this);
      reader.readAsBinaryString(file);
    }
  }

  handleReaderLoaded(e: any) {
    this.uploadedFiles.push('data:image/png;base64,' + btoa(e.target.result));
    this.editForm.get(['ad_url'])?.setValue({ file: this.uploadedFiles });
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<Advertisement>>
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
   * @param advertisement
   */
  protected updateForm(advertisement: Advertisement): void {
    this.editForm.patchValue({
      id: advertisement.id,
      description: advertisement.description,
      status: advertisement.status,
      start_date:
        advertisement.start_date !== undefined
          ? new Date(advertisement.start_date!)
          : advertisement.start_date,
      end_date:
        advertisement.end_date !== undefined
          ? new Date(advertisement.end_date!)
          : advertisement.end_date,
      ad_url: advertisement.ad_url,
    });
  }

  /**
   * Return form values as object of type Advertisement
   * @returns Advertisement
   */
  protected createFromForm(): Advertisement {
    return {
      ...new Advertisement(),
      id: this.editForm.get(['id'])!.value,
      description: this.editForm.get(['description'])!.value,
      status: this.editForm.get(['status'])!.value,
      start_date: this.editForm.get(['start_date'])!.value,
      end_date: this.editForm.get(['end_date'])!.value,
      ad_url: this.editForm.get(['ad_url'])!.value,
    };
  }
}
