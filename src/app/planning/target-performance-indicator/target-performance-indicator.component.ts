/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { FinancialYear } from 'src/app/setup/financial-year/financial-year.model';
import { ToastService } from 'src/app/shared/toast.service';
import { LongTermTarget } from '../long-term-target/long-term-target.model';

import { TargetPerformanceIndicator } from './target-performance-indicator.model';
import { TargetPerformanceIndicatorService } from './target-performance-indicator.service';
import { TargetPerformanceIndicatorUpdateComponent } from './update/target-performance-indicator-update.component';

@Component({
  selector: 'app-target-performance-indicator',
  templateUrl: './target-performance-indicator.component.html',
})
export class TargetPerformanceIndicatorComponent implements OnInit {
  targetPerformanceIndicators?: TargetPerformanceIndicator[] = [];
  @Input() financialYears: FinancialYear[] = [];
  @Input() longTermTarget?: LongTermTarget;
  isLoading = false;
  constructor(
    protected targetPerformanceIndicatorService: TargetPerformanceIndicatorService,
    protected confirmationService: ConfirmationService,
    protected dialogService: DialogService,
    protected toastService: ToastService
  ) {}

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    if (!this.longTermTarget) {
      return;
    }
    this.isLoading = true;
    this.targetPerformanceIndicatorService
      .query({
        long_term_target_id: this.longTermTarget?.id!,
        with: ['performanceIndicator'],
      })
      .subscribe(
        (resp) => {
          this.isLoading = false;
          this.targetPerformanceIndicators = (resp.data || []).map((i) => {
            return {
              ...i,
              year_values: i.year_values ? JSON.parse(i.year_values) : [],
            };
          });
        },
        (error: HttpErrorResponse) => {
          this.isLoading = false;
        }
      );
  }

  /**
   * Creating or updating TargetPerformanceIndicator
   * @param targetPerformanceIndicator ; If undefined initize new model to create else edit existing model
   */
  createOrUpdate(
    targetPerformanceIndicator?: TargetPerformanceIndicator
  ): void {
    const targetIndicator: TargetPerformanceIndicator =
      targetPerformanceIndicator ?? {
        ...new TargetPerformanceIndicator(),
        long_term_target_id: this.longTermTarget?.id,
      };
    const ref = this.dialogService.open(
      TargetPerformanceIndicatorUpdateComponent,
      {
        data: {
          targetIndicator,
          financialYears: this.financialYears,
          longTermTargets: [this.longTermTarget],
        },
        header: 'Create/Update TargetPerformanceIndicator',
      }
    );
    ref.onClose.subscribe((result) => {
      if (result) {
        this.loadAll();
      }
    });
  }

  /**
   * Delete TargetPerformanceIndicator
   * @param targetPerformanceIndicator
   */
  delete(
    $event: any,
    targetPerformanceIndicator: TargetPerformanceIndicator
  ): void {
    this.confirmationService.confirm({
      target: $event.target,
      key: 'kpi',
      message:
        'Are you sure that you want to delete this TargetPerformanceIndicator?',
      accept: () => {
        this.targetPerformanceIndicatorService
          .delete(targetPerformanceIndicator.id!)
          .subscribe((resp) => {
            this.loadAll();
            this.toastService.info(resp.message);
          });
      },
    });
  }
}
