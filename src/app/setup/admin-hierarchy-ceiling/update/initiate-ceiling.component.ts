import { Component, OnInit } from '@angular/core';
import { FundSourceBudgetClassService } from '../../fund-source-budget-class/fund-source-budget-class.service';
import { CustomResponse } from '../../../utils/custom-response';
import { Section } from '../../section/section.model';
import { FundSourceBudgetClass } from '../../fund-source-budget-class/fund-source-budget-class.model';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-initiate-ceiling',
  templateUrl: './initiate-ceiling.component.html',
  styleUrls: ['./initiate-ceiling.component.scss'],
})
export class InitiateCeilingComponent implements OnInit {
  ceilings?: any[] = [];
  selectedSource: any[] = [];
  constructor(
    private fundSourceBudgetClassService: FundSourceBudgetClassService,
    public dialogRef: DynamicDialogRef
  ) {}

  ngOnInit(): void {
    this.fundSourceBudgetClassService
      .queryProjectionCeiling({ can_project: true, page: 1 })
      .subscribe(
        (resp: CustomResponse<Section[]>) => (this.ceilings = resp.data ?? [])
      );
  }
  initiate(raw: FundSourceBudgetClass): void {
    this.selectedSource.push(raw);
    this.ceilings = this.ceilings!.filter((obj) => obj !== raw);
  }

  save(): void {}

  close(): void {
    this.dialogRef.close(true);
  }
}
