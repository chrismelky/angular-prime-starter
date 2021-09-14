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
import { CustomResponse } from 'src/app/utils/custom-response';
import { StrategicPlan } from '../strategic-plan/strategic-plan.model';
import { StrategicPlanService } from '../strategic-plan/strategic-plan.service';
import { LongTermTargetComponent } from './long-term-target.component';

@Injectable({ providedIn: 'root' })
export class StrategicPlanResolveService implements Resolve<StrategicPlan> {
  constructor(
    protected service: StrategicPlanService,
    protected router: Router
  ) {}

  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<StrategicPlan> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((organisation: CustomResponse<StrategicPlan>) => {
          if (organisation.data) {
            return of(organisation.data);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return EMPTY;
  }
}

const routes: Routes = [
  {
    path: '',
    component: LongTermTargetComponent,
    data: {
      defaultSort: 'id:asc',
    },
    resolve: {
      strategicPlan: StrategicPlanResolveService,
    },
    //canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LongTermTargetRoutingModule {}
