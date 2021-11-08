/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, TreeNode } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';

import { HelperService } from 'src/app/utils/helper.service';
import { ToastService } from 'src/app/shared/toast.service';
import { AdminHierarchy } from 'src/app/setup/admin-hierarchy/admin-hierarchy.model';
import { Section } from 'src/app/setup/section/section.model';

import { ScrutinizationService } from './scrutinization.service';
import { ScrutinyActivity } from '../activity/activity.model';
import { Scrutinization } from './scrutinization.model';
import { User } from '../../setup/user/user.model';
import { UserService } from '../../setup/user/user.service';
import { ActivityInput } from '../../budgeting/activity-input/activity-input.model';
import { FinancialYearService } from 'src/app/setup/financial-year/financial-year.service';
import { ActivityService } from '../activity/activity.service';
import { OverlayPanel } from 'primeng/overlaypanel';
import { Comment } from './comment/comment.model';
import { CommentComponent } from './comment/comment.component';
import { DecisionLevel } from 'src/app/setup/decision-level/decision-level.model';
import { DecisionLevelService } from 'src/app/setup/decision-level/decision-level.service';

@Component({
  selector: 'app-scrutinization',
  templateUrl: './scrutinization.component.html',
})
export class ScrutinizationComponent implements OnInit {
  @ViewChild('paginator', { static: true }) paginator!: Paginator;
  @ViewChild('table') table!: Table;
  @ViewChild('adminPanel') adminPanel!: OverlayPanel;
  @ViewChild('costCentrePanel') costCentrePanel!: OverlayPanel;
  scrutinizations?: Scrutinization[] = [];
  inputs?: ActivityInput[] = [];

  adminHierarchies?: AdminHierarchy[] = [];
  sections?: Section[] = [];
  departments?: Section[] = [];
  activities?: ScrutinyActivity[] = [];
  expandedRowKeys: any = {};

  columns = []; //Table display columns

  isLoading = false;
  page: number = 1;
  per_page!: number;
  totalItems = 0;

  //Mandatory filter
  admin_hierarchy_id!: number;
  section_id!: number;
  parent_id!: number;
  admin_hierarchy_position!: number;
  budget_type = 'CURRENT';
  currentUser: User;
  financialYearId?: number;

  selectedAdminHierarchy: any;
  nodes: TreeNode[] = [];
  treeLoading = false;
  userAdminHierarchy?: AdminHierarchy;
  submittedCostCentres?: Scrutinization[] = [];
  selectedCostCentre?: Scrutinization;
  userDecionLevel?: DecisionLevel;
  returnDecionLevel?: DecisionLevel;

  constructor(
    protected scrutinizationService: ScrutinizationService,
    protected userService: UserService,
    protected confirmationService: ConfirmationService,
    protected dialogService: DialogService,
    protected helper: HelperService,
    protected toastService: ToastService,
    protected financialYearService: FinancialYearService,
    protected activityService: ActivityService,
    protected decisionLevelService: DecisionLevelService
  ) {
    this.currentUser = userService.getCurrentUser();
  }

  ngOnInit(): void {
    this.userAdminHierarchy = this.currentUser.admin_hierarchy;
    this.userDecionLevel = this.currentUser.decision_level;
    this.financialYearService.findByStatus(1).subscribe((resp) => {
      this.financialYearId = resp.data?.id;
      this.createRootAdminHierarchy();
    });
  }

  createRootAdminHierarchy(): void {
    if (this.userAdminHierarchy && this.userDecionLevel) {
      this.scrutinizationService
        .getSubmittedAdminHierarchies(
          this.userDecionLevel?.id!,
          this.financialYearId!,
          this.userAdminHierarchy.id!,
          `p${this.userAdminHierarchy.admin_hierarchy_position}`,
          `p${this.userAdminHierarchy.admin_hierarchy_position! + 1}`
        )
        .subscribe((resp) => {
          this.nodes = [
            {
              label: this.userAdminHierarchy?.name,
              data: this.userAdminHierarchy,
              key: this.userAdminHierarchy?.id?.toString(),
              children: this.getNodes(resp.data || []),
              leaf: false,
              expanded: true,
            },
          ];
        });

      this.selectedAdminHierarchy = this.nodes[0];

      this.loadSubmittedCostCentres(this.userAdminHierarchy?.id!);
    }
  }

  loadSubmittedCostCentres(adminHierarchyId: number): void {
    this.scrutinizationService
      .getSubmittedCostCentres(
        this.userDecionLevel?.id!,
        this.financialYearId!,
        adminHierarchyId
      )
      .subscribe((resp) => {
        this.submittedCostCentres = resp.data;
      });
  }

  nodeExpand(event: any): any {
    let selected: TreeNode = event.node;
    this.treeLoading = true;
    this.scrutinizationService
      .getSubmittedAdminHierarchies(
        this.userDecionLevel?.id!,
        this.financialYearId!,
        selected.data.id,
        `p${selected.data.admin_hierarchy_position}`,
        `p${selected.data.admin_hierarchy_position + 1}`
      )
      .subscribe(
        (resp) => {
          this.treeLoading = false;
          selected.children = this.getNodes(resp.data || []);
        },
        (error) => {
          this.treeLoading = false;
        }
      );
  }

  private getNodes(data: AdminHierarchy[]): TreeNode[] {
    return data?.map((a) => {
      return {
        label: a.name,
        key: a.id?.toString(),
        data: a,
        leaf: false,
        parent: undefined,
      };
    });
  }

  onAdminHierarchyChange(event?: any): void {
    this.loadSubmittedCostCentres(this.selectedAdminHierarchy.data.id);
    this.adminPanel && this.adminPanel.hide();
    this.selectedCostCentre = undefined;
    this.activities = [];
  }

  onCostCentreChange(): void {
    this.scrutinizationService
      .find(this.selectedCostCentre?.id!, {
        columns: ['id', 'page'],
      })
      .subscribe((resp) => {
        this.totalItems = resp.data?.page!;
        const page = resp.data?.page! - 1;
        setTimeout(() => {
          this.paginator.changePage(page);
        });
      });
    this.costCentrePanel && this.costCentrePanel.hide();
  }

  loadActivities(): void {
    this.isLoading = true;
    this.activityService
      .scrutinyActivities({
        financial_year_id: this.financialYearId,
        admin_hierarchy_id: this.selectedAdminHierarchy.data.id,
        section_id: this.selectedCostCentre?.section_id,
        budget_type: this.selectedCostCentre?.budget_type,
        page: this.page,
        scrutinization_id: this.selectedCostCentre?.id,
      })
      .subscribe(
        (resp) => {
          this.isLoading = false;
          this.expandedRowKeys = {};
          this.activities = resp.data?.map((a) => {
            return {
              ...a,
              hasComment:
                a.comments?.find(
                  (c) => c.scrutinization_id === this.selectedCostCentre?.id
                ) !== undefined,
              inputs: a.inputs?.map((i) => {
                return {
                  ...i,
                  hasComment:
                    i.comments?.find(
                      (i) => i.scrutinization_id === this.selectedCostCentre?.id
                    ) !== undefined,
                };
              }),
            };
          });
          this.totalItems = resp.total;
          if (this.activities?.length) {
            this.expandedRowKeys[this.activities[0].id!.toString()] = true;
          }
        },
        (error) => (this.isLoading = false)
      );
  }

  /**
   * When page changed
   * @param event page event
   */
  pageChanged(event: any): void {
    this.page = event.page + 1;
    this.loadActivities();
  }

  confirmForwardOrReturn(nextlevel: DecisionLevel, isReturned: boolean): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to ${
        isReturned ? 'Return' : 'Forward'
      } this cost centre to ${nextlevel.name}`,
      accept: () => {
        const data = {
          ...new Scrutinization(),
          admin_hierarchy_cost_centre_id:
            this.selectedCostCentre?.admin_hierarchy_cost_centre_id,
          admin_hierarchy_id: this.selectedCostCentre?.admin_hierarchy_id,
          section_id: this.selectedCostCentre?.section_id,
          decision_level_id: nextlevel?.id,
          from_decision_level_id: this.userDecionLevel?.id,
          financial_year_id: this.selectedCostCentre?.financial_year_id,
          budget_type: this.budget_type,
          hierarchy_position:
            this.selectedCostCentre?.admin_hierarchy?.admin_hierarchy_position,
          is_returned: isReturned,
        };
        this.scrutinizationService.create(data).subscribe((resp) => {
          this.loadSubmittedCostCentres(this.selectedAdminHierarchy.data.id);
        });
      },
    });
  }

  returnCostCentre(): void {
    this.decisionLevelService
      .getReturnDecisionLevel(
        this.userDecionLevel?.id!,
        this.selectedCostCentre?.admin_hierarchy?.admin_hierarchy_position!
      )
      .subscribe((resp) => {
        if (resp.data) {
          this.confirmForwardOrReturn(resp.data, true);
        } else {
          this.toastService.warn('No return decision level found');
        }
      });
  }

  forwardCostCentre(): void {
    this.confirmForwardOrReturn(
      this.userDecionLevel?.next_decision_level!,
      false
    );
  }

  /**
   * Creating or updating Comment
   * @param sectorProblem ; If undefined initize new model to create else edit existing model
   */
  createOrUpdate(
    comments: Comment[],
    commentableType: string,
    commentable: any
  ): void {
    const currentComment: Comment = comments.find((c) => {
      return (
        c.scrutinization_id === this.selectedCostCentre?.id &&
        c.financial_year_id === this.financialYearId
      );
    }) ?? {
      ...new Comment(),
      scrutinization_id: this.selectedCostCentre?.id,
      financial_year_id: this.financialYearId,
      commentable_id: commentable.id,
      commentable_type: commentableType,
    };
    const ref = this.dialogService.open(CommentComponent, {
      data: {
        currentComment,
        otherComments: comments.filter(
          (c) => c.scrutinization_id !== this.selectedCostCentre?.id
        ),
      },
      header: 'Create/Update Comments',
    });
    ref.onClose.subscribe((newComments) => {
      if (newComments) {
        commentable.hasComment = true;
        commentable.comments = newComments;
      }
    });
  }
}
