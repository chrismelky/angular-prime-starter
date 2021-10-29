import {Component, OnInit} from "@angular/core";
import {ActivityImplementation} from "../activity-implementation.model";
import {ActivityImplementationService} from "../activity-implementation.service";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {FormBuilder} from "@angular/forms";
import {ToastService} from "../../../shared/toast.service";
import {CustomResponse} from "../../../utils/custom-response";

@Component({
  selector: "app-activity-implementation-evidence",
  templateUrl: "./activity-implementation-evidence.component.html",
})
export class ActivityImplementationEvidenceComponent implements OnInit {

  activity?: ActivityImplementation;
  activities?: ActivityImplementation[] = [];
  implementationStatus?: ActivityImplementation[] = [];
  constructor(
    protected activityImplementationService: ActivityImplementationService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {
    this.activity = dialogConfig.data;
  }
  ngOnInit(): void {
    this.activityImplementationService.query({activity_id: this.activity?.activity_id, financial_year_id: this.activity?.financial_year_id})
      .subscribe((resp: CustomResponse<ActivityImplementation[]>)=>(this.implementationStatus = resp.data));
  }

}
