import { Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ToastService } from 'src/app/shared/toast.service';
import { FinancialYear } from '../financial-year.model';
import { FinancialYearService } from '../financial-year.service';

type PreRequisite = {
  messages: string[];
  failed: boolean;
  canBudgetLevels: any[];
};
@Component({
  selector: 'app-financial-year-open',
  templateUrl: './financial-year-open.component.html',
})
export class FinancialYearOpenComponent implements OnInit {
  financialYear?: FinancialYear;
  preRequisite?: PreRequisite;
  isOpening = false;
  isCheking = false;
  nodes?: TreeNode[] = [];

  constructor(
    protected financialYearService: FinancialYearService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    public toastService: ToastService
  ) {
    this.financialYear = dialogConfig.data;
  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {
    this.isCheking = true;
    this.financialYearService
      .openPreRequisite(this.financialYear?.id!)
      .subscribe(
        (resp) => {
          this.isCheking = false;
          this.preRequisite = resp.data;
          this.nodes = this.preRequisite?.canBudgetLevels.map((c) => {
            return {
              label: c.name,
              data: c.name,
              expanded: true,
              children: c.cost_centres.map((co: any) => {
                return {
                  label: co.name,
                  data: co.name,
                  leaf: true,
                };
              }),
              leaf: false,
            };
          });
        },
        (error) => (this.isCheking = false)
      );
  }

  open(): void {
    if (this.preRequisite?.failed) {
      return;
    }
    this.isCheking = false;
    this.isOpening = true;

    this.financialYearService.open(this.financialYear?.id!).subscribe(
      (resp) => {
        this.isOpening = false;
        this.dialogRef.close(true);
        this.toastService.info('Financial year opened successfully');
      },
      (error) => (this.isOpening = false)
    );
  }
}
