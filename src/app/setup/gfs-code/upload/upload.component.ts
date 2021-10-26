import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {ToastService} from "../../../shared/toast.service";
import {Observable} from "rxjs";
import {CustomResponse} from "../../../utils/custom-response";
import {finalize} from "rxjs/operators";
import {GfsCodeService} from "../gfs-code.service";
import {saveAs} from "file-saver";
import {AccountType} from "../../account-type/account-type.model";
import {GfsCodeCategoryTree} from "../../gfs-code-category/gfs-code-category.model";
import {AccountTypeService} from "../../account-type/account-type.service";
import {GfsCodeCategoryService} from "../../gfs-code-category/gfs-code-category.service";

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
  accountTypes?: AccountType[] = [];
  categories?: GfsCodeCategoryTree[] = [];

  editForm = this.fb.group({
    category_id: [null, [Validators.required]],
    account_type_id: [null, [Validators.required]],
    file: [[], [Validators.required]],
  });

  constructor(
    protected gfsCodeService: GfsCodeService,
    public dialogRef: DynamicDialogRef,
    protected accountTypeService: AccountTypeService,
    protected categoryService: GfsCodeCategoryService,
    public config: DynamicDialogConfig,
    public fb: FormBuilder,
    private toastService: ToastService,
  ) {

  }

  ngOnInit(): void {
    this.accountTypeService
      .query({columns: ["id", "name"]})
      .subscribe(
        (resp: CustomResponse<AccountType[]>) => (this.accountTypes = resp.data)
      );
    this.categoryService
      .tree()
      .subscribe(
        (resp: CustomResponse<GfsCodeCategoryTree[]>) => (this.categories = resp.data)
      );
  }

  onUpload(event: any): void {
    if (this.editForm.invalid) {
      this.formError = true;
      console.log(this.editForm.value);
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

  downloadTemplate() {
    this.gfsCodeService
      .downloadTemplate()
      .subscribe((response: BlobPart) => {
        saveAs(
          new Blob([response], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          }),
          'gfs-code-upload-template.xlsx'
        );
      });
  }
}
