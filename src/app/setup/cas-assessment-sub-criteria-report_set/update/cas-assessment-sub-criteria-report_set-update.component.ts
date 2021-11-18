/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import {Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild} from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";

import { CustomResponse } from "../../../utils/custom-response";
import { CasPlanContent } from "src/app/setup/cas-plan-content/cas-plan-content.model";
import { CasPlanContentService } from "src/app/setup/cas-plan-content/cas-plan-content.service";
import { CasAssessmentSubCriteriaOption } from "src/app/setup/cas-assessment-sub-criteria-option/cas-assessment-sub-criteria-option.model";
import { CasAssessmentSubCriteriaOptionService } from "src/app/setup/cas-assessment-sub-criteria-option/cas-assessment-sub-criteria-option.service";
import {CasAssessmentSubCriteriaReportSet, MyNode} from "../cas-assessment-sub-criteria-report_set.model";
import { CasAssessmentSubCriteriaReportSetService } from "../cas-assessment-sub-criteria-report_set.service";
import { ToastService } from "src/app/shared/toast.service";
import {TreeNode} from "primeng/api";
import {OverlayPanel} from "primeng/overlaypanel";
import {AdminHierarchy} from "../../admin-hierarchy/admin-hierarchy.model";
import {LocalStorageService} from "ngx-webstorage";
import {ITEMS_PER_PAGE} from "../../../config/pagination.constants";

@Component({
  selector: 'app-cas-assessment-sub-criteria-report_set-update',
  templateUrl: './cas-assessment-sub-criteria-report_set-update.component.html',
})
export class CasAssessmentSubCriteriaReportSetUpdateComponent
  implements OnInit
{
  treeLoading: boolean = false;
  nodes: MyNode[] = [];
  selectedValue: any;
  @Input() selectionMode: string = 'single';
  @Input() returnType: string = 'id';
  @Input() stateKey?: string;
  @Output() onSelect: EventEmitter<any> = new EventEmitter();
  @ViewChild('op') panel!: OverlayPanel;
  isSaving = false;
  formError = false;
  page?: number = 1;
  per_page!: number;
  errors = [];
  cas_plan_content_id: any;
  casPlanContents?: CasPlanContent[] = [];
  casAssessmentSubCriteriaOptions?: CasAssessmentSubCriteriaOption[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
     cas_plan_contents: [null, []],
    cas_assessment_sub_criteria_option_id: [null, []],
   });

  constructor(
    protected casAssessmentSubCriteriaReportSetService: CasAssessmentSubCriteriaReportSetService,
    protected casPlanContentService: CasPlanContentService,
    protected casAssessmentSubCriteriaOptionService: CasAssessmentSubCriteriaOptionService,
    public dialogRef: DynamicDialogRef,
    protected localStorageService: LocalStorageService,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.casAssessmentSubCriteriaReportSetService
      .loadCasContents(this.dialogConfig.data.cas_plan_id)
      .subscribe(
        (resp: CustomResponse<CasPlanContent[]>) => {
          this.casPlanContents = resp.data;
          if (this.casPlanContents!.length > 0) {
            for (let i=0; i<this.casPlanContents!.length;i++){
              this.nodes.push({
                id: this.casPlanContents![i].id,
                label: this.casPlanContents![i].name,
                children: this.casPlanContents![i].children,
                leaf: false,
              });
            }
          }
        }
      );
    this.casAssessmentSubCriteriaOptionService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<CasAssessmentSubCriteriaOption[]>) =>
          (this.casAssessmentSubCriteriaOptions = resp.data)
      );
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }
  /**
   * When form is valid Create CasAssessmentSubCriteriaReportSet or Update if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    let data:CasAssessmentSubCriteriaReportSet[] = [];
    const casAssessmentSubCriteriaReportSet = this.createFromForm();
    for (let i=0; i< casAssessmentSubCriteriaReportSet.cas_plan_contents.length; i++){
      data.push({cas_assessment_sub_criteria_option_id:casAssessmentSubCriteriaReportSet.cas_assessment_sub_criteria_option_id,
        cas_plan_content_id:casAssessmentSubCriteriaReportSet.cas_plan_contents[i].id,
        id:casAssessmentSubCriteriaReportSet.id,
        report_id:casAssessmentSubCriteriaReportSet.cas_plan_contents[i].report_id
      });
    }
    this.subscribeToSaveResponse(
      this.casAssessmentSubCriteriaReportSetService.create(
        data
      )
    );
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<CasAssessmentSubCriteriaReportSet>>
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
    this.toastService.info(result.message);
    this.dialogRef.close(true);
  }

  /**
   * Error handling specific to this component
   * Note; general error handling is done by ErrorInterceptor
   * @param error
   */
  protected onSaveError(error: any): void {}

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  /**
   * Set/Initialize form values
   * @param casAssessmentSubCriteriaReportSet
   */
  protected updateForm(
    casAssessmentSubCriteriaReportSet: CasAssessmentSubCriteriaReportSet
  ): void {
    this.editForm.patchValue({
      id: casAssessmentSubCriteriaReportSet.id,
      cas_plan_contents:
        casAssessmentSubCriteriaReportSet.cas_plan_contents,
      cas_assessment_sub_criteria_option_id:
        casAssessmentSubCriteriaReportSet.cas_assessment_sub_criteria_option_id,
    });
  }

  /**
   * Return form values as object of type CasAssessmentSubCriteriaReportSet
   * @returns CasAssessmentSubCriteriaReportSet
   */
  protected createFromForm(): CasAssessmentSubCriteriaReportSet {
    return {
      ...new CasAssessmentSubCriteriaReportSet(),
      id: this.editForm.get(["id"])!.value,
      cas_plan_contents: this.editForm.get(["cas_plan_contents"])!.value,
      cas_plan_content_id: this.editForm.get(['cas_plan_content_id'])!.value,
      cas_assessment_sub_criteria_option_id: this.editForm.get([
        'cas_assessment_sub_criteria_option_id',
      ])!.value,
    };
  }
}
