import { Component, Inject, OnInit } from "@angular/core";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import {FormBuilder, Validators} from "@angular/forms";
import {UserService} from "../../../setup/user/user.service";
import {ToastService} from "../../../shared/toast.service";
import {User} from "../../../setup/user/user.model";
import {AssessmentCriteriaService} from "../assessment-criteria.service";
import {AssessmentCriteria} from "../assessment-criteria.model";
@Component({
  selector: "app-set-comment",
  templateUrl: "./set-comment.component.html",
})

export class SetCommentComponent implements OnInit {
  currentUser!: User;
  isSaving = false;
  formError = false;
  errors = [];

  commentForm = this.fb.group({
    id: [null, []],
    remarks: [null, [Validators.required]],
  });

  constructor(
    protected userService: UserService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    protected casAssessmentResultsService: AssessmentCriteriaService,
    private toastService: ToastService
  ) {
    this.currentUser = userService.getCurrentUser();
  }

  ngOnInit(): void {
  }

  save() {
    let data = {
      id: this.dialogConfig.data.data.cas_assessment_result_comment_id!,
      admin_hierarchy_id: this.dialogConfig.data.admin_hierarchy_id,
      admin_hierarchy_position:this.currentUser.admin_hierarchy?.admin_hierarchy_position,
      cas_assessment_sub_criteria_option_id:this.dialogConfig.data.data.id,
      financial_year_id:this.dialogConfig.data.financial_year[0].id,
      remarks:this.commentForm.value.remarks,
      cas_assessment_round_id:this.dialogConfig.data.cas_assessment_round[0].id
    }
     if (this.commentForm.invalid) {
      this.formError = true;
      return;
    }
    if(this.dialogConfig.data.data.cas_assessment_result_comment_id){
      this.isSaving = true;
      this.casAssessmentResultsService.updateComment(data)
        .subscribe(resp => {
        this.toastService.info(resp.message);
        this.dialogRef.close(true);
        this.isSaving = false;
      })
      ;
    } else {
      this.isSaving = true;
      this.casAssessmentResultsService.createComment(data).subscribe(resp => {
        this.toastService.info(resp.message);
        this.dialogRef.close(true);
        this.isSaving = false;
      });
    }
  }
  /**
   * Set/Initialize form values
   * @param
   */
  protected updateForm(
    casAssessmentSubCriteriaPossibleScore:AssessmentCriteria
  ): void {
    this.commentForm.patchValue({
      id: casAssessmentSubCriteriaPossibleScore.cas_assessment_result_comment_id,
      remarks: casAssessmentSubCriteriaPossibleScore.remarks
    });
  }
  /**
   * Return form values as object of type CasAssessmentSubCriteriaPossibleScore
   * @returns
   */
  protected createFromForm(): any {
    return {
      id: this.commentForm.get(["cas_assessment_result_comment_id"])!.value,
      remarks: this.commentForm.get(["remarks"])!.value,
    };
  }
}
