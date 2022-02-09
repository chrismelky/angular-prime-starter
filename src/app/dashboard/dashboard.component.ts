/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, OnInit } from '@angular/core';
import { EnumService } from '../shared/enum.service';
import { CeilingBudgetRevenueExpenditure } from './dashboard.model';
import { DashboardService } from './dashboard.service';
import { saveAs } from 'file-saver';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  constructor(
    protected dashboardService: DashboardService,
    protected enumService: EnumService
  ) {}

  ngOnInit(): void {}
}
