/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */

import { Injectable, NgModule } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterModule,
  Routes,
} from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { FinancialYear } from 'src/app/setup/financial-year/financial-year.model';
import { FinancialYearService } from 'src/app/setup/financial-year/financial-year.service';
import { CustomResponse } from 'src/app/utils/custom-response';
import { AdminHierarchyCostCentre } from '../admin-hierarchy-cost-centres/admin-hierarchy-cost-centre.model';
import { AdminHierarchyCostCentreService } from '../admin-hierarchy-cost-centres/admin-hierarchy-cost-centre.service';
import { ActivityComponent } from './activity.component';

@Injectable({ providedIn: 'root' })
export class AdminHierarchyCostCentreResolveService
  implements Resolve<AdminHierarchyCostCentre>
{
  constructor(
    protected service: AdminHierarchyCostCentreService,
    protected router: Router
  ) {}

  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<AdminHierarchyCostCentre> | Observable<never> {
    const id = route.params['adminHierarchyCostCentreId'];
    const budgetType = route.params['budgetType'];
    let eagerWith = ['adminHierarchy', 'section'];
    let columns = ['id', 'admin_hierarchy_id', 'section_id'];

    switch (budgetType) {
      case 'CURRENT' || 'APPROVED':
        eagerWith.push(
          'currentBudgetDecisionLevel',
          'currentBudgetDecisionLevel.nextDecisionLevel'
        );
        columns.push(
          'is_current_budget_locked',
          'is_current_budget_approved',
          'current_budget_decision_level_id'
        );
        break;
      case 'CARRYOVER':
        eagerWith.push(
          'carryOverBudgetDecisionLevel',
          'carryOverBudgetDecisionLevel.nextDecisionLevel'
        );
        columns.push(
          'is_carryover_budget_locked',
          'is_carryover_budget_approved',
          'carryover_budget_decision_level_id'
        );
        break;
      case 'SUPPLEMENTARY':
        eagerWith.push(
          'supplementaryOverBudgetDecisionLevel',
          'supplementaryOverBudgetDecisionLevel.nextDecisionLevel'
        );
        columns.push(
          'is_supplementary_budget_locked',
          'is_supplementary_budget_approved',
          'supplementary_budget_decision_level_id'
        );
        break;
      default:
        break;
    }

    if (id) {
      return this.service
        .find(id, {
          columns,
          with: eagerWith,
        })
        .pipe(
          mergeMap((resp: CustomResponse<AdminHierarchyCostCentre>) => {
            if (resp.data) {
              return of(resp.data);
            } else {
              return EMPTY;
            }
          })
        );
    }
    return EMPTY;
  }
}

@Injectable({ providedIn: 'root' })
export class PlanningFinancialYearResolveService
  implements Resolve<FinancialYear>
{
  constructor(
    protected service: FinancialYearService,
    protected router: Router
  ) {}

  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<FinancialYear> | Observable<never> {
    return this.service.findByStatus(1).pipe(
      mergeMap((resp: CustomResponse<FinancialYear>) => {
        if (resp.data) {
          return of(resp.data);
        } else {
          return EMPTY;
        }
      })
    );
  }
}

const routes: Routes = [
  {
    path: ':budgetType/:adminHierarchyCostCentreId',
    component: ActivityComponent,
    data: {
      defaultSort: 'id:asc',
    },
    resolve: {
      adminHierarchyCostCentre: AdminHierarchyCostCentreResolveService,
      financialYear: PlanningFinancialYearResolveService,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActivityRoutingModule {}
