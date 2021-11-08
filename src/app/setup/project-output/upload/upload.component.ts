import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {ToastService} from "../../../shared/toast.service";
import {Observable} from "rxjs";
import {CustomResponse} from "../../../utils/custom-response";
import {finalize} from "rxjs/operators";
import {saveAs} from "file-saver";
import {ProjectOutputService} from "../project-output.service";

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
  sector_id!: number;
  expenditure_category_id!: number;

  constructor(
    protected projectOutputService: ProjectOutputService,
    public dialogRef: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public fb: FormBuilder,
    private toastService: ToastService,
  ) {
    this.sector_id = this.config.data.sectorId;
    this.expenditure_category_id = this.config.data.expenditureCategoryId;
    this.editForm = this.fb.group({
      file: [],
      expenditure_category_id: [this.expenditure_category_id],
      sector_id: [this.sector_id],
    });
  }

  ngOnInit(): void {
  }

  onUpload(event: any): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    const data = this.createFromForm();
    this.subscribeToSaveResponse(
      this.projectOutputService.upload(data)
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
    fd.append('sector_id', this.editForm.get(['sector_id'])!.value);
    fd.append('expenditure_category_id', this.editForm.get(['expenditure_category_id'])!.value);
    fd.append('file', this.editForm.get(['file'])!.value);
    return fd;
  }

  downloadTemplate() {
    this.projectOutputService
      .downloadTemplate()
      .subscribe((response: BlobPart) => {
        saveAs(
          new Blob([response], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          }),
          'project-output-upload-template.xlsx'
        );
      });
  }
}