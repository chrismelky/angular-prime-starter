import { Component, OnInit, ViewChild } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { OverlayPanel } from 'primeng/overlaypanel';
import { AdminHierarchyLevel } from 'src/app/setup/admin-hierarchy-level/admin-hierarchy-level.model';
import { AdminHierarchyLevelService } from 'src/app/setup/admin-hierarchy-level/admin-hierarchy-level.service';
import {
  AdminHierarchy,
  AdminHierarchyTarget,
} from 'src/app/setup/admin-hierarchy/admin-hierarchy.model';
import { AdminHierarchyService } from 'src/app/setup/admin-hierarchy/admin-hierarchy.service';
import { GenericPriority } from 'src/app/setup/generic-priority/generic-priority.model';
import { GenericPriorityService } from 'src/app/setup/generic-priority/generic-priority.service';
import { Section } from 'src/app/setup/section/section.model';
import { ToastService } from 'src/app/shared/toast.service';
import { FinancialYear } from '../../../setup/financial-year/financial-year.model';
import { FinancialYearTarget } from '../financial-year-target.model';
import { FinancialYearTargetService } from '../financial-year-target.service';
import { LongTermTarget } from '../long-term-target.model';

@Component({
  selector: 'app-financial-year-target-view',
  templateUrl: './financial-year-target-view.component.html',
  styleUrls: ['./financial-year-target-view.component.scss'],
})
export class FinancialYearTargetViewComponent implements OnInit {
  @ViewChild('genericPriorityPanel') genericPriorityPanel!: OverlayPanel;

  longTermTarget?: LongTermTarget;
  financialYearId?: number;
  currentFinancialYear?: FinancialYear;
  currentPosition?: number;
  strategicPlanAdminHierarchyId?: number;
  adminLevels?: AdminHierarchyLevel[] = [];
  childAdminHierarchyTargets?: AdminHierarchyTarget[] = [];
  currentAdminTarget: FinancialYearTarget = {};
  section?: Section;
  genericPriorities?: GenericPriority[] = [];
  genericPriority?: GenericPriority;
  paramValues: any = {};
  params: any[] = [];
  paramsError = false;
  adminHierarchies?: AdminHierarchy[] = [];
  adminAreaTargetToAdd?: AdminHierarchyTarget;

  formError = false;
  isSaving = false;
  isLoading = false;
  // position?: number;
  selectedLevel?: AdminHierarchyLevel;

  constructor(
    protected financialYearTargetService: FinancialYearTargetService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected adminLevelService: AdminHierarchyLevelService,
    protected adminAreaService: AdminHierarchyService,
    protected toastrService: ToastService,
    protected genericPriorityService: GenericPriorityService
  ) {}

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {
    const dialogData = this.dialogConfig.data;
    this.currentFinancialYear = dialogData.currentFinancialYear;
    this.financialYearId = dialogData.financialYearId;
    this.longTermTarget = dialogData.longTermTarget;
    this.currentPosition = dialogData.currentPosition;
    this.section = dialogData.section;
    this.strategicPlanAdminHierarchyId =
      dialogData.strategicPlanAdminHierarchyId;

    this.genericPriorityService
      .bySector(this.section?.sector_id!)
      .subscribe((resp) => {
        this.genericPriorities = resp.data;
      });
    this.adminLevelService
      .lowerLevelsCanBudget(this.currentPosition)
      .subscribe((resp) => {
        this.adminLevels = resp.data;
        if (this.adminLevels?.length) {
          this.selectedLevel = this.adminLevels[0];
          this.loadChildrenTarget();
        }
      });
    this.financialYearTargetService
      .findByTargetAndAdminArea(
        this.longTermTarget?.id!,
        this.financialYearId!,
        this.strategicPlanAdminHierarchyId!,
        this.longTermTarget?.section_id!
      )
      .subscribe((resp) => {
        this.currentAdminTarget = resp.data || {
          ...new FinancialYearTarget(),
          admin_hierarchy_id: this.strategicPlanAdminHierarchyId,
          description: this.longTermTarget?.description,
        };
      });
  }

  loadChildrenTarget(): void {
    if (!this.selectedLevel) {
      return;
    }

    this.adminAreaService
      .withTargets({
        parent: `p${this.currentPosition}`,
        parent_id: this.strategicPlanAdminHierarchyId,
        long_term_target_id: this.longTermTarget?.id,
        financial_year_id: this.financialYearId,
        position: this.selectedLevel.position,
      })
      .subscribe((resp) => this.filterAdminAreas(resp.data));
  }

  private filterAdminAreas(adminAreaWithTarget?: AdminHierarchyTarget[]): void {
    this.childAdminHierarchyTargets = adminAreaWithTarget?.filter(
      (ct) => ct.description !== null
    );
    this.adminHierarchies = adminAreaWithTarget?.filter(
      (ct) => ct.description === null
    );
  }

  prepareParams(): void {
    if (this.genericPriority && this.genericPriority.params) {
      this.params = this.genericPriority.params.split(',');
    }
  }

  /**
   * Create priority from template
   * @returns
   */
  createFromGeneric(): void {
    // Validate params
    this.paramsError = false;
    if (!this.genericPriority) {
      this.paramsError = true;
    }
    this.params.forEach((p) => {
      if (!this.paramValues[p]) {
        this.paramsError = true;
      }
    });
    if (this.paramsError) {
      return;
    }

    let description = this.genericPriority?.description;
    this.params.forEach((p) => {
      description = description?.replace(p, this.paramValues[p]);
    });

    this.adminAreaTargetToAdd!.description = description;

    this.save(this.adminAreaTargetToAdd!, false);

    this.adminAreaTargetToAdd = undefined;

    this.loadChildrenTarget();

    this.genericPriorityPanel?.hide();
  }

  save(target: FinancialYearTarget, close: boolean): void {
    if (!target.description || !target.description.length) {
      return;
    }

    if (target.id) {
      this.financialYearTargetService.update(target).subscribe((resp) => {
        this.toastrService.info('Target updated successfully');
        close && this.dialogRef.close(true);
      });
    } else {
      const data: FinancialYearTarget = {
        ...target,
        long_term_target_id: this.longTermTarget?.id,
        code: this.longTermTarget?.code,
        section_id: this.longTermTarget?.section_id,
        financial_year_id: this.financialYearId,
        objective_id: this.longTermTarget?.objective_id,
        generic_target_id: this.longTermTarget?.generic_target_id,
      };
      this.financialYearTargetService.create(data).subscribe((resp) => {
        target.id = resp.data?.id;
        this.toastrService.info('Target created successfully');
        close && this.dialogRef.close(true);
      });
    }
  }
}
