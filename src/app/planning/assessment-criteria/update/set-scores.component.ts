import { Component, Inject, OnInit } from "@angular/core";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import {FormBuilder, Validators} from "@angular/forms";
@Component({
  selector: "app-set-scores",
  templateUrl: "./set-scores.component.html",
})

export class SetScoresComponent implements OnInit {
  /**
   * Declare form
   */
  scoreForm = this.fb.group({
    id: [null, []],
    cas_assessment_sub_criteria_possible_score_id: [null, [Validators.required]],
  });
  possibleScores: any;
  constructor(
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
  ) {}
  ngOnInit(): void {
    this.possibleScores = this.dialogConfig.data.data.cas_assessment_sub_criteria_possible_score
  }

  save() {
    console.log(this.scoreForm.value)
    console.log(this.dialogConfig.data);
  }
}
