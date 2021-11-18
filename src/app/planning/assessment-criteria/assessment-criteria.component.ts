/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { combineLatest } from "rxjs";
import {ConfirmationService, LazyLoadEvent, MenuItem, TreeNode} from "primeng/api";
import { DialogService } from "primeng/dynamicdialog";
import { Paginator } from "primeng/paginator";
import { Table } from "primeng/table";

import { CustomResponse } from "../../utils/custom-response";
import {
  ITEMS_PER_PAGE,
  PER_PAGE_OPTIONS,
} from "../../config/pagination.constants";
import { HelperService } from "src/app/utils/helper.service";
import { ToastService } from "src/app/shared/toast.service";
import { AdminHierarchy } from "src/app/setup/admin-hierarchy/admin-hierarchy.model";
import { AdminHierarchyService } from "src/app/setup/admin-hierarchy/admin-hierarchy.service";
import { FinancialYear } from "src/app/setup/financial-year/financial-year.model";
import { FinancialYearService } from "src/app/setup/financial-year/financial-year.service";
import { CasAssessmentRound } from "src/app/setup/cas-assessment-round/cas-assessment-round.model";
import { CasAssessmentRoundService } from "src/app/setup/cas-assessment-round/cas-assessment-round.service";

import { AssessmentCriteria } from "./assessment-criteria.model";
import { AssessmentCriteriaService } from "./assessment-criteria.service";
import { AssessmentCriteriaUpdateComponent } from "./update/assessment-criteria-update.component";
import {CasAssessmentCriteriaOptionService} from "../../setup/cas-assessment-criteria-option/cas-assessment-criteria-option.service";
import {CasAssessmentSubCriteriaOptionService} from "../../setup/cas-assessment-sub-criteria-option/cas-assessment-sub-criteria-option.service";
import {CasAssessmentSubCriteriaOption} from "../../setup/cas-assessment-sub-criteria-option/cas-assessment-sub-criteria-option.model";
import {SetScoresComponent} from "./update/set-scores.component";
import {SetCommentComponent} from "./update/set-comment.component";
import {FormBuilder, Validators} from "@angular/forms";
import {UserService} from "../../setup/user/user.service";
import {User} from "../../setup/user/user.model";
import {ReportUpdateComponent} from "../../execution/report/update/report-update.component";



@Component({
  selector: "app-assessment-criteria",
  templateUrl: "./assessment-criteria.component.html",
  styleUrls: ['./assessment-criteria.component.scss'],
})
export class AssessmentCriteriaComponent implements OnInit {
  @ViewChild("paginator") paginator!: Paginator;
  @ViewChild("table") table!: Table;
  assessmentCriteriaData?: AssessmentCriteria[] = [];

  adminHierarchies?: AdminHierarchy[] = [];
  financialYears?: FinancialYear[] = [];
  casAssessmentRounds?: CasAssessmentRound[] = [];
  assessmentSubCriteriaOptions?: CasAssessmentSubCriteriaOption[] = [];
  cols = [{
    field: "name",
    header: "Name",
    sort: true,
  },
    {
      field: "number",
      header: "Number",
      sort: true,
    },]; //Table display columns
  commentForm = this.fb.group({
    id: [null, []],
    remarks: [null, [Validators.required]],
  });
  isLoading = false;
  page?: number = 1;
  per_page!: number;
  totalItems = 0;
  perPageOptions = PER_PAGE_OPTIONS;
  predicate!: string; //Sort column
  ascending!: boolean; //Sort direction asc/desc
  search: any = {}; // items search objects
  isSaving = false;
  errors = [];
  //Mandatory filter
  admin_hierarchy_id!: number;
  financial_year_id!: number;
  cas_assessment_round_id!: number;
  cas_assessment_category_version_id: number;
  admin_hierarchy_level_id!: number | undefined;
  currentUser: User;
  formError = false;
  admin_hierarchy_position!: number;
  position3 = false;
  position2 = false;
  position1 = false;
  selectedIndex = 0;

  constructor(
    protected assessmentCriteriaService: AssessmentCriteriaService,
    protected casAssessmentSubCriteriaService: CasAssessmentSubCriteriaOptionService,
    protected adminHierarchyService: AdminHierarchyService,
    protected financialYearService: FinancialYearService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected fb: FormBuilder,
    protected casAssessmentResultsService: AssessmentCriteriaService,
    protected confirmationService: ConfirmationService,
    protected dialogService: DialogService,
    protected helper: HelperService,
    protected actRoute: ActivatedRoute,
    protected userService: UserService,
    protected toastService: ToastService
  ) {
    this.cas_assessment_category_version_id = this.actRoute.snapshot.params.id;
    this.cas_assessment_round_id = this.actRoute.snapshot.params.round_id;
    this.financial_year_id = this.actRoute.snapshot.params.fy_id;
    this.currentUser = userService.getCurrentUser();
    this.admin_hierarchy_level_id = this.currentUser.admin_hierarchy?.admin_hierarchy_position;
    }

  ngOnInit(): void {
    if (this.currentUser.admin_hierarchy?.admin_hierarchy_position == 3){
      this.position3 = true;
    }
    if (this.currentUser.admin_hierarchy?.admin_hierarchy_position == 2){
      this.position2 = true;
    }
    if (this.currentUser.admin_hierarchy?.admin_hierarchy_position == 1){
      this.position1 = true;
    }
    this.assessmentCriteriaService.find(this.cas_assessment_category_version_id)
      .subscribe((resp:CustomResponse<AssessmentCriteria[]>) => {
        this.assessmentCriteriaData = resp.data;
      });
    this.assessmentCriteriaService.getDataByUser(this.cas_assessment_round_id, this.financial_year_id,
      this.cas_assessment_category_version_id,this.currentUser.id,this.currentUser.admin_hierarchy?.admin_hierarchy_position)
      .subscribe((resp) => {
        this.adminHierarchies = resp.data.adminHierarchies;
        this.financialYears = resp.data.financialYears;
        this.casAssessmentRounds = resp.data.casRounds;
      });
    this.handleNavigation();
  }

  /**
   * Load data from api
   * @param page = page number
   * @param dontNavigate = if after successfully update url params with pagination and sort info
   */
  loadPage(page?: number, dontNavigate?: boolean): void {
    if (
      !this.admin_hierarchy_id ||
      !this.financial_year_id ||
      !this.cas_assessment_round_id
    ) {
      return;
    }
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;
    this.per_page = this.per_page ?? ITEMS_PER_PAGE;
    this.assessmentCriteriaService
      .query({
        page: pageToLoad,
        per_page: this.per_page,
        sort: this.sort(),
        admin_hierarchy_id: this.admin_hierarchy_id,
        financial_year_id: this.financial_year_id,
        cas_assessment_round_id: this.cas_assessment_round_id,
        ...this.helper.buildFilter(this.search),
      })
      .subscribe(
        (res: CustomResponse<AssessmentCriteria[]>) => {
          this.isLoading = false;
          this.onSuccess(res, pageToLoad, !dontNavigate);
        },
        () => {
          this.isLoading = false;
          this.onError();
        }
      );
  }

  /**
   * Called initialy/onInit to
   * Restore page, sort option from url query params if exist and load page
   */
  protected handleNavigation(): void {
    combineLatest([
      this.activatedRoute.data,
      this.activatedRoute.queryParamMap,
    ]).subscribe(([data, params]) => {
      const page = params.get("page");
      const perPage = params.get("per_page");
      const sort = (params.get("sort") ?? data["defaultSort"]).split(":");
      const predicate = sort[0];
      const ascending = sort[1] === "asc";
      this.per_page = perPage !== null ? parseInt(perPage) : ITEMS_PER_PAGE;
      this.page = page !== null ? parseInt(page) : 1;
      if (predicate !== this.predicate || ascending !== this.ascending) {
        this.predicate = predicate;
        this.ascending = ascending;
      }
    });
  }

  /**
   * Mandatory filter field changed;
   * Mandatory filter= fields that must be specified when requesting data
   * @param event
   */
  filterChanged(): void {
    if (this.page !== 1) {
      setTimeout(() => this.paginator.changePage(0));
    } else {
      this.loadPage(1);
    }
  }

  /**
   * search items by @var search params
   */
  onSearch(): void {
    if (this.page !== 1) {
      this.paginator.changePage(0);
    } else {
      this.loadPage();
    }
  }

  /**
   * Clear search params
   */
  clearSearch(): void {
    this.search = {};
    if (this.page !== 1) {
      this.paginator.changePage(0);
    } else {
      this.loadPage();
    }
  }

  /**
   * Sorting changed
   * predicate = column to sort by
   * ascending = sort ascending else descending
   * @param $event
   */
  onSortChange($event: LazyLoadEvent): void {
    if ($event.sortField) {
      this.predicate = $event.sortField!;
      this.ascending = $event.sortOrder === 1;
      this.loadPage();
    }
  }

  /**
   * When page changed
   * @param event page event
   */
  pageChanged(event: any): void {
    this.page = event.page + 1;
    this.per_page = event.rows!;
    this.loadPage();
  }

  /**
   * Impletement sorting Set/Reurn the sorting option for data
   * @returns dfefault ot id sorting
   */
  protected sort(): string[] {
    const predicate = this.predicate ? this.predicate : "id";
    const direction = this.ascending ? "asc" : "desc";
    return [`${predicate}:${direction}`];
  }

  /**
   * Creating or updating AssessmentCriteria
   * @param assessmentCriteria ; If undefined initize new model to create else edit existing model
   */
  createOrUpdate(assessmentCriteria?: AssessmentCriteria): void {
    const data: AssessmentCriteria = assessmentCriteria ?? {
      ...new AssessmentCriteria(),
      admin_hierarchy_id: this.admin_hierarchy_id,
      financial_year_id: this.financial_year_id,
      cas_assessment_round_id: this.cas_assessment_round_id,
    };
    const ref = this.dialogService.open(AssessmentCriteriaUpdateComponent, {
      data,
      header: "Create/Update AssessmentCriteria",
    });
    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadPage(this.page);
      }
    });
  }

  /**
   * Delete AssessmentCriteria
   * @param assessmentCriteria
   */
  delete(assessmentCriteria: AssessmentCriteria): void {
    this.confirmationService.confirm({
      message: "Are you sure that you want to delete this AssessmentCriteria?",
      accept: () => {
        this.assessmentCriteriaService
          .delete(assessmentCriteria.id!)
          .subscribe((resp) => {
            this.loadPage(this.page);
            this.toastService.info(resp.message);
          });
      },
    });
  }

  /**
   * When successfully data loaded
   * @param resp
   * @param page
   * @param navigate
   */
  protected onSuccess(
    resp: CustomResponse<CasAssessmentSubCriteriaOption[]> | null,
    page: number,
    navigate: boolean
  ): void {
    this.totalItems = resp?.total!;
    this.page = page;
    if (navigate) {
      this.router.navigate(["/assessment-criteria"], {
        queryParams: {
          page: this.page,
          per_page: this.per_page,
          sort:
            this.predicate ?? "id" + ":" + (this.ascending ? "asc" : "desc"),
        },
      });
    }
    this.assessmentSubCriteriaOptions = resp?.data ?? [];
  }

  /**
   * When error on loading data set data to empty and reset page to load
   */
  protected onError(): void {
    setTimeout(() => (this.table.value = []));
    this.page = 1;
    this.toastService.error("Error loading Assessment Criteria");
  }

  loadSubCriteria(id: any, i: number) {
    this.selectedIndex = i;
    this.casAssessmentSubCriteriaService.getSubCriteriaWithScores(
      id,this.admin_hierarchy_id,this.financial_year_id,this.cas_assessment_round_id,
      this.admin_hierarchy_level_id,this.cas_assessment_category_version_id
    ).subscribe((resp: CustomResponse<CasAssessmentSubCriteriaOption[]>) => ( this.assessmentSubCriteriaOptions = resp.data));

  }

  setScores(assessmentSubCriteriaOption: any) {
    let data = {
      data: assessmentSubCriteriaOption,
      admin_hierarchy_id: this.admin_hierarchy_id,
      financial_year: this.financialYears,
      cas_assessment_round: this.casAssessmentRounds,
      cas_assessment_category_version_id: this.cas_assessment_category_version_id
    }
    const ref = this.dialogService.open(SetScoresComponent, {
       data,
      header: "Save/Update Scores",
    });
    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadSubCriteria(result, 1);
      }
    });
  }

  setComments(assessmentSubCriteriaOption: any) {
    let data = {
      data: assessmentSubCriteriaOption,
      admin_hierarchy_id: this.admin_hierarchy_id,
      financial_year: this.financialYears,
      cas_assessment_round: this.casAssessmentRounds,
      cas_assessment_category_version_id: this.cas_assessment_category_version_id
    }
    const ref = this.dialogService.open(SetCommentComponent, {
       data,
      header: "Save/Update Comments",
    });
    ref.onClose.subscribe((result) => {
      if (result) {
        // this.loadPage(this.page);
      }
    });
  }

  getReport(assessmentSubCriteriaOption: any) {
    const data = assessmentSubCriteriaOption;
    data.admin_hierarchy_id = this.admin_hierarchy_id;
    data.financial_year_id = this.financial_year_id;
    data.budgetType = 'CURRENT';
    const ref = this.dialogService.open(ReportUpdateComponent, {
      data,
      header: '',
    });
    ref.onClose.subscribe((result) => {
      if (result) {
        // this.loadPage(this.page);
      }
    });
  }

  getAssessmentReport() {
    this.assessmentCriteriaService.getAssessmentReport(this.admin_hierarchy_id,this.admin_hierarchy_level_id!,this.financial_year_id,this.cas_assessment_round_id,this.cas_assessment_category_version_id).subscribe(resp =>{
      let file = new Blob([resp], { type: 'application/pdf'});
      let fileURL = URL.createObjectURL(file);
      window.open(fileURL,"_blank");
    });
  }
  /**
   *
   * @param event adminhierarchyId or Ids
   */
  onAdminHierarchySelection(event: any): void {

    this.admin_hierarchy_id = event.id;
    this.admin_hierarchy_position =event.admin_hierarchy_position;
  }

  /**
   *
   * @param event adminhierarchyId & cas assessment criteria Ids
   */
  confirmPlan() {
    this.confirmationService.confirm({
      header: 'Confirm Plan',
      message: 'Are you sure that you want to perform this action?. This action cannot be undone',
      accept: () => {
        let data = {
          cas_assessment_round_id: this.cas_assessment_round_id,
          financial_year_id: this.financial_year_id,
          admin_hierarchy_level_id: this.admin_hierarchy_level_id,
          admin_hierarchy_id: this.admin_hierarchy_id,
          cas_assessment_category_version_id:this.cas_assessment_category_version_id,
          remarks : this.commentForm.value.remarks,
          is_confirmed : true,
          }
        if (this.commentForm.invalid) {
          this.formError = true;
          this.toastService.error('Please write your remarks before confirming assessment plan');
          return;
        }
        this.confirmRound(data);
        this.saveOrUpdateComment(data);
      }
    });
  }

  finishAndQuit() {
    this.confirmationService.confirm({
      header: 'Confirm Finish and Quit',
      message: 'All your work will be saved. Continue?',
      accept: () => {
        //Actual logic to perform a confirmation
        this.router.navigate(["/assessment-home"])
      }
    });
  }

  forwardPlan() {
  let data = {
    forward_from: this.currentUser.admin_hierarchy?.admin_hierarchy_position,
    forward_to:this.currentUser.admin_hierarchy?.admin_hierarchy_position! - 1,
    admin_hierarchy_id: this.admin_hierarchy_id,
    cas_assessment_category_version_id:this.cas_assessment_category_version_id,
    cas_assessment_round_id: this.cas_assessment_round_id,
    financial_year_id: this.financial_year_id,
    admin_hierarchy_level_id: this.currentUser.admin_hierarchy?.admin_hierarchy_position,
    remarks : this.commentForm.value.remarks,
  }
  this.updatePlan(data);
    this.saveOrUpdateComment(data);
  }

  saveOrUpdateComment(data: any){
    this.casAssessmentSubCriteriaService.createGeneralComment(data).subscribe(resp => {
      this.toastService.info(resp.message);
    });
  }

  updatePlan(data : any) {
    this.casAssessmentResultsService.updatePlan(data).subscribe(resp => {
      this.toastService.info(resp.message);
      this.router.navigate(["/assessment-home"])
    });
  }

 confirmRound(data: {}) {
    this.casAssessmentResultsService.confirmRound(data).subscribe(resp => {
      this.toastService.info(resp.message);
      this.router.navigate(["/assessment-home"])
    });
  }
}
