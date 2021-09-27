import { Component, OnInit } from '@angular/core';
import {AdminHierarchyCeilingService} from "../admin-hierarchy-ceiling.service";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {FormBuilder, Validators,FormGroup} from "@angular/forms";
import {Observable} from "rxjs";
import {CustomResponse} from "../../../utils/custom-response";
import {StrategicPlan} from "../../../setup/strategic-plan/strategic-plan.model";
import {finalize} from "rxjs/operators";
import {ToastService} from "../../../shared/toast.service";

@Component({
  selector: 'app-upload-ceiling',
  templateUrl: './upload-ceiling.component.html',
  styleUrls: ['./upload-ceiling.component.scss']
})
export class UploadCeilingComponent implements OnInit {
  uploadedFiles: any[] = [];

  // @ts-ignore
  /**
   * Declare form
   */
  ceilingUploadFrom :FormGroup;

  constructor(
    protected adminHierarchyCeilingService: AdminHierarchyCeilingService,
    public dialogRef: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public fb: FormBuilder,
    private toastService: ToastService,
  ) {
    this.ceilingUploadFrom = this.fb.group({
      admin_hierarchy_id: [this.config.data.admin_hierarchy_id],
      budget_type: [this.config.data.budget_type],
      section_id: [this.config.data.section_id],
      financial_year_id: [this.config.data.financial_year_id],
      file:[]
    })
  }

  ngOnInit(): void {
  }

  onUpload(event: any) :void{
    const ceilings = this.createFromForm();
    this.subscribeToSaveResponse(
      this.adminHierarchyCeilingService.uploadCeiling(ceilings)
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
    this.dialogRef.close({result:result});
    this.toastService.info(result.message);
  }

  /**
   * Error handling specific to this component
   * Note; general error handling is done by ErrorInterceptor
   * @param error
   */
  protected onSaveError(error: any): void {}

  protected onSaveFinalize(): void {
  }

  onSelect(event: any) {
    // @ts-ignore
    if (event.files?.length)
      this.ceilingUploadFrom.patchValue({
        file: event.files[0],
      });
  }

  /**
   * Return form values as object of type StrategicPlan
   * @returns StrategicPlan
   */
  protected createFromForm(): FormData {
    const fd = new FormData();
    fd.append('admin_hierarchy_id',
      this.ceilingUploadFrom.get(['admin_hierarchy_id'])!.value
    );
    fd.append(
      'financial_year_id',
      this.ceilingUploadFrom.get(['financial_year_id'])!.value
    );
    fd.append(
      'section_id',
      this.ceilingUploadFrom.get(['section_id'])!.value
    );
    fd.append(
      'budget_type',
      this.ceilingUploadFrom.get(['budget_type'])!.value
    );
    fd.append('file', this.ceilingUploadFrom.get(['file'])!.value);
    return fd;
  }

}
