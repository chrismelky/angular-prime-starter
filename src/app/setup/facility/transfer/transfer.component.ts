import {Component, OnInit} from '@angular/core';
import {AdminHierarchy} from "../../admin-hierarchy/admin-hierarchy.model";
import {FacilityService} from "../facility.service";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {Facility} from "../facility.model";
import {ToastService} from "../../../shared/toast.service";
import {Observable} from "rxjs";
import {CustomResponse} from "../../../utils/custom-response";
import {finalize} from "rxjs/operators";

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.scss']
})
export class TransferComponent implements OnInit {
  adminHierarchy!: AdminHierarchy;
  facility!: Facility;
  isSaving = false;

  constructor(protected facilityService: FacilityService,
              public dialogRef: DynamicDialogRef,
              public toastService: ToastService,
              public dialogConfig: DynamicDialogConfig) {
    this.facility = this.dialogConfig.data.facility as Facility;
  }

  ngOnInit(): void {
  }

  save(): void {
    const facility = this.facility;
    facility.admin_hierarchy_id = this.adminHierarchy.id;
    this.subscribeToSaveResponse(this.facilityService.update(facility));
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<Facility>>
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
    this.toastService.info('Facility Transferred Successfully!');
    this.dialogRef.close(true);
  }

  /**
   * Error handling specific to this component
   * Note; general error handling is done by ErrorInterceptor
   * @param error
   */
  protected onSaveError(error: any): void {
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  onAdminHierarchySelection(adminHierarchy: AdminHierarchy): void {
    this.adminHierarchy = adminHierarchy;
  }
}
