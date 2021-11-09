import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AdminHierarchyLevel } from 'src/app/setup/admin-hierarchy-level/admin-hierarchy-level.model';
import { AdminHierarchyLevelService } from 'src/app/setup/admin-hierarchy-level/admin-hierarchy-level.service';
import { AdminHierarchyTarget } from 'src/app/setup/admin-hierarchy/admin-hierarchy.model';
import { AdminHierarchyService } from 'src/app/setup/admin-hierarchy/admin-hierarchy.service';
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
  longTermTarget?: LongTermTarget;
  financialYearId?: number;
  currentFinancialYear?: FinancialYear;
  currentPosition?: number;
  strategicPlanAdminHierarchyId?: number;
  adminLevels?: AdminHierarchyLevel[] = [];
  childAdminHierarchyTargets?: AdminHierarchyTarget[] = [];
  currentAdminTarget: FinancialYearTarget = {};
  section?: Section;

  formError = false;
  isSaving = false;
  isLoading = false;
  constructor(
    protected financialYearTargetService: FinancialYearTargetService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    public adminLevelService: AdminHierarchyLevelService,
    public adminAreaService: AdminHierarchyService,
    public toastrService: ToastService
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
    this.adminLevelService
      .lowerLevelsCanBudget(this.currentPosition)
      .subscribe((resp) => {
        this.adminLevels = resp.data;
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
        };
      });
  }

  loadChildrenTarget(position: number): void {
    this.adminAreaService
      .withTargets({
        parent: `p${this.currentPosition}`,
        parent_id: this.strategicPlanAdminHierarchyId,
        long_term_target_id: this.longTermTarget?.id,
        financial_year_id: this.financialYearId,
        position,
      })
      .subscribe((resp) => {
        this.childAdminHierarchyTargets = resp.data;
      });
  }

  save(target: FinancialYearTarget): void {
    if (!target.description || !target.description.length) {
      return;
    }

    if (target.id) {
      this.financialYearTargetService.update(target).subscribe((resp) => {
        this.toastrService.info('Target updated successfully');
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
      });
    }
  }
}
