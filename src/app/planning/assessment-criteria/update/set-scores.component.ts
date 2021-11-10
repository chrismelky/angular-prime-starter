import { Component, Inject, OnInit } from "@angular/core";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import {FormBuilder, Validators} from "@angular/forms";
import {UserService} from "../../../setup/user/user.service";
import {User} from "../../../setup/user/user.model";
import {AssessmentCriteriaService} from "../assessment-criteria.service";
import {ToastService} from "../../../shared/toast.service";
import {CasAssessmentSubCriteriaPossibleScoreService} from "../../../setup/cas-assessment-sub-criteria-possible_score/cas-assessment-sub-criteria-possible_score.service";
import {CustomResponse} from "../../../utils/custom-response";
import {CasAssessmentSubCriteriaPossibleScore} from "../../../setup/cas-assessment-sub-criteria-possible_score/cas-assessment-sub-criteria-possible_score.model";
import {PER_PAGE_OPTIONS} from "../../../config/pagination.constants";
import {AssessmentCriteria} from "../assessment-criteria.model";
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
  isLoading = false;
  page?: number = 1;
  per_page!: number;
  totalItems = 0;
  perPageOptions = PER_PAGE_OPTIONS;
  predicate!: string; //Sort column
  ascending!: boolean; //Sort direction asc/desc
  search: any = {}; // items search objects

  scoreForm = this.fb.group({
    id: [null, []],
    cas_assessment_sub_criteria_possible_score_id: [null, [Validators.required]],
  });
  possibleScores: any;
  currentUser!: User;
  constructor(
    protected userService: UserService,
    protected casAssessmentResultsService: AssessmentCriteriaService,
    protected casAssessmentPossibleScore: CasAssessmentSubCriteriaPossibleScoreService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {
    this.currentUser = userService.getCurrentUser();
  }
  ngOnInit(): void {
    this.casAssessmentPossibleScore.query({
      page: this.page,
      perPage: this.per_page,
      cas_assessment_sub_criteria_option_id: this.dialogConfig.data.data.id
    })
      .subscribe((resp:CustomResponse<any[]>) => {
        this.possibleScores = resp.data;
      });
  }

  save() {
    let data = {
      id: this.dialogConfig.data.data.cas_assessment_result_id!,
      admin_hierarchy_id: this.dialogConfig.data.admin_hierarchy_id,
      financial_year_id: this.dialogConfig.data.financial_year[0].id,
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

    if (this.dialogConfig.data.data.cas_assessment_result_id) {
      this.casAssessmentResultsService.update(data).subscribe(resp => {
        this.toastService.info(resp.message);
        this.dialogRef.close(this.dialogConfig.data.data.cas_assessment_criteria_option_id);
      });
    } else {
      this.casAssessmentResultsService.create(data).subscribe(resp => {
        this.toastService.info(resp.message);
        this.dialogRef.close(this.dialogConfig.data.data.cas_assessment_criteria_option_id);
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
    this.scoreForm.patchValue({
      id: casAssessmentSubCriteriaPossibleScore.id,
      value: casAssessmentSubCriteriaPossibleScore.value,
      description: casAssessmentSubCriteriaPossibleScore.description
    });
  }
  /**
   * Return form values as object of type CasAssessmentSubCriteriaPossibleScore
   * @returns
   */
  protected createFromForm(): any {
    return {
      id: this.scoreForm.get(["cas_assessment_result_id"])!.value,
      value: this.scoreForm.get(["value"])!.value,
      description: this.scoreForm.get(["description"])!.value,
    };
  }
}
