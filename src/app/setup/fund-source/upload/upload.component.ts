import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {ToastService} from "../../../shared/toast.service";
import {Observable} from "rxjs";
import {CustomResponse} from "../../../utils/custom-response";
import {finalize} from "rxjs/operators";
import {FundSourceService} from "../fund-source.service";
import {Router} from "@angular/router";
import {environment} from "../../../../environments/environment";
import {LocalStorageService, SessionStorageService} from "ngx-webstorage";
import {saveAs} from "file-saver";

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
    protected fundSourceService: FundSourceService,
    public dialogRef: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public fb: FormBuilder,
    protected router: Router,
    private localStorage: LocalStorageService,
    private sessionStorage: SessionStorageService,
    private toastService: ToastService,
  ) {
    this.editForm = this.fb.group({
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
    const items = this.createFromForm();
    this.subscribeToSaveResponse(
      this.fundSourceService.upload(items)
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
    fd.append('file', this.editForm.get(['file'])!.value);
    return fd;
  }

  downloadTemplate() {
    this.fundSourceService
      .downloadTemplate()
      .subscribe((response: BlobPart) => {
        saveAs(
          new Blob([response], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          }),
          'fund-source-upload-template.xlsx'
        );
      });
  }
}