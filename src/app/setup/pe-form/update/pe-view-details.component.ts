import { Component, Inject, OnInit } from "@angular/core";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import {FormBuilder} from "@angular/forms";
@Component({
  selector: "app-pe-view-details",
  templateUrl: "./pe-view-details.component.html",
})

export class PeViewDetailsComponent implements OnInit {

  constructor(
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
  ) {}

  data:any;
  ngOnInit(): void {
    this.data = this.dialogConfig.data
  }

}
