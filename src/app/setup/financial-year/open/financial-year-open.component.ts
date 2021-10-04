import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FinancialYear } from '../financial-year.model';
import { FinancialYearService } from '../financial-year.service';

type PreRequisite = {
  messages: string[];
  failed: boolean;
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

  constructor(
    protected financialYearService: FinancialYearService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig
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
          console.log(resp);
          console.log(this.preRequisite);
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
      },
      (error) => (this.isOpening = false)
    );
  }
}
