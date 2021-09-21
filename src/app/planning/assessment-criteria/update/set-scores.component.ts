import { Component, Inject, OnInit } from "@angular/core";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import {FormBuilder, Validators} from "@angular/forms";
import {UserService} from "../../../setup/user/user.service";
import {User} from "../../../setup/user/user.model";
import {AssessmentCriteriaService} from "../assessment-criteria.service";
import {ToastService} from "../../../shared/toast.service";
@Component({
  selector: "app-set-scores",
  templateUrl: "./set-scores.component.html",
})

export class SetScoresComponent implements OnInit {
  /**
   * Declare form
   */
  isSaving = false;
  formError = false;
  errors = [];

  scoreForm = this.fb.group({
    id: [null, []],
    cas_assessment_sub_criteria_possible_score_id: [null, [Validators.required]],
  });
  possibleScores: any;
  currentUser!: User;
  constructor(
    protected userService: UserService,
    protected casAssessmentResultsService: AssessmentCriteriaService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {
    this.currentUser = userService.getCurrentUser();
  }
  ngOnInit(): void {
    this.possibleScores = this.dialogConfig.data.data.cas_assessment_sub_criteria_possible_score
  }

  save() {
    let data = {
      admin_hierarchy_id: this.dialogConfig.data.admin_hierarchy_id,
      is_returned:false,
      cas_assessment_sub_criteria_option_id:this.dialogConfig.data.data.id,
      cas_assessment_sub_criteria_possible_score_id:this.scoreForm.value.cas_assessment_sub_criteria_possible_score_id,
      cas_assessment_state:'Assessed',
      cas_assessment_round_id:this.dialogConfig.data.cas_assessment_round[0].id,
      is_confirmed:false,
      is_selected:false,
      admin_hierarchy_level_id:this.currentUser.admin_hierarchy?.admin_hierarchy_position,
      user_id:this.currentUser.id,
      cas_assessment_category_version_id:this.dialogConfig.data.cas_assessment_category_version_id
    };

    if (this.scoreForm.invalid) {
      this.formError = true;
      return;
    }
    this.casAssessmentResultsService.create(data).subscribe(resp => {
      this.toastService.info(resp.message);
      this.dialogRef.close(true);
    });
  }

}
