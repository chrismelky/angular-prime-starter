import { Component, Inject, OnInit } from "@angular/core";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import {FormBuilder} from "@angular/forms";
@Component({
  selector: "app-set-comment",
  templateUrl: "./set-comment.component.html",
})

export class SetCommentComponent implements OnInit {

  constructor(
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
  ) {}

  ngOnInit(): void {
  }

}
