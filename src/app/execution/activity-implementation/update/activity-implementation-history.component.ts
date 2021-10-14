import {Component, OnInit} from "@angular/core";
import {ActivityImplementation} from "../activity-implementation.model";
import {ActivityImplementationService} from "../activity-implementation.service";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {FormBuilder} from "@angular/forms";
import {ToastService} from "../../../shared/toast.service";

@Component({
  selector: "app-activity-implementation-history",
  templateUrl: "./activity-implementation-history.component.html",
})

export class ActivityImplementationHistoryComponent implements OnInit {

  activity?: ActivityImplementation;
  activities?: ActivityImplementation[] = [];
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
  }

}
