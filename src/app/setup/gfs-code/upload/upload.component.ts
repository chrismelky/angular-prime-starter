import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {ToastService} from "../../../shared/toast.service";
import {Observable} from "rxjs";
import {CustomResponse} from "../../../utils/custom-response";
import {finalize} from "rxjs/operators";
import {GfsCodeService} from "../gfs-code.service";

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {
  uploadedFiles: any[] = [];
  formError = false;
  // @ts-ignore
  /**
   * Declare form
   */
  editForm: FormGroup;

  constructor(
    protected gfsCodeService: GfsCodeService,
    public dialogRef: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public fb: FormBuilder,
    private toastService: ToastService,
  ) {
    this.editForm = this.fb.group({
      category_id: [this.config.data.category_id, [Validators.required]],
      account_type_id: [this.config.data.account_type_id, [Validators.required]],
      file: []
    })
  }

  ngOnInit(): void {
  }

  onUpload(event: any): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    const gfsCodes = this.createFromForm();
    this.subscribeToSaveResponse(
      this.gfsCodeService.upload(gfsCodes)
    );
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<any>>
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
    this.dialogRef.close({result: result});
    this.toastService.info(result.message);
  }

  /**
   * Error handling specific to this component
   * Note; general error handling is done by ErrorInterceptor
   * @param error
   */
  protected onSaveError(error: any): void {
  }

  protected onSaveFinalize(): void {
  }

  onSelect(event: any) {
    // @ts-ignore
    if (event.files?.length)
      this.editForm.patchValue({
        file: event.files[0],
      });
  }

  /**
   * Return form values as object of type StrategicPlan
   * @returns StrategicPlan
   */
  protected createFromForm(): FormData {
    const fd = new FormData();
    fd.append('category_id',
      this.editForm.get(['category_id'])!.value
    );
    fd.append(
      'account_type_id',
      this.editForm.get(['account_type_id'])!.value
    );
    fd.append('file', this.editForm.get(['file'])!.value);
    return fd;
  }
}
