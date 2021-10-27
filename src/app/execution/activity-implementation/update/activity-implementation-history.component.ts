import {Component, OnInit} from "@angular/core";
import {ActivityImplementation} from "../activity-implementation.model";
import {ActivityImplementationService} from "../activity-implementation.service";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {FormBuilder} from "@angular/forms";
import {ToastService} from "../../../shared/toast.service";
import {CustomResponse} from "../../../utils/custom-response";
import {Period} from "../../../setup/period/period.model";
import {PeriodService} from "../../../setup/period/period.service";

@Component({
  selector: "app-activity-implementation-history",
  templateUrl: "./activity-implementation-history.component.html",
})

export class ActivityImplementationHistoryComponent implements OnInit {

  activity?: ActivityImplementation;
  activities?: ActivityImplementation[] = [];
  implementationStatus?: ActivityImplementation[] = [];
  periods?: Period[] = [];
  constructor(
    protected activityImplementationService: ActivityImplementationService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder
  ) {
    this.activity = dialogConfig.data;
    console.log(this.activity);
  }
  ngOnInit(): void {
    this.activityImplementationService.getProgressReport({
      activity_id: this.activity?.activity_id,
      period_id: this.activity?.period_id,
      financial_year_id: this.activity?.financial_year_id})
      .subscribe((resp: CustomResponse<ActivityImplementation[]>)=>(this.implementationStatus = resp.data));
  }

}
