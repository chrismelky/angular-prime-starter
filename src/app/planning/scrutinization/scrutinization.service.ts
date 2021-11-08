/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { createRequestOption } from '../../utils/request-util';
import { CustomResponse } from '../../utils/custom-response';
import { Scrutinization } from './scrutinization.model';
import { Activity } from '../activity/activity.model';
import { ActivityInput } from '../../budgeting/activity-input/activity-input.model';
import { AdminHierarchy } from 'src/app/setup/admin-hierarchy/admin-hierarchy.model';
import { Comment } from './comment/comment.model';

@Injectable({ providedIn: 'root' })
export class ScrutinizationService {
  public commentsUrl = 'api/scrutinization_comments';
  private activitiesUrl = 'api/scrutinization_activities';
  private activityInputUrl = 'api/scrutinization_inputs';

  private scrutinizationUrl = 'api/scrutinizations';

  constructor(protected http: HttpClient) {}

  create(scrutinization: Scrutinization): Observable<CustomResponse<any>> {
    return this.http.post<CustomResponse<any>>(
      this.scrutinizationUrl,
      scrutinization
    );
  }

  createComment(comment: Comment): Observable<CustomResponse<Comment>> {
    return this.http.post<CustomResponse<Comment>>(this.commentsUrl, comment);
  }

  addressComment(comment: Comment): Observable<CustomResponse<Comment[]>> {
    return this.http.put<CustomResponse<Comment[]>>(
      `${this.commentsUrl}/address/${comment.id}`,
      comment
    );
  }

  updateComment(comment: Comment): Observable<CustomResponse<Comment>> {
    return this.http.put<CustomResponse<Comment>>(
      `${this.commentsUrl}/${comment.id}`,
      comment
    );
  }

  find(id: number, req?: any): Observable<CustomResponse<Scrutinization>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<Scrutinization>>(
      `${this.scrutinizationUrl}/${id}`,
      {
        params: options,
      }
    );
  }

  queryActivities(req?: any): Observable<CustomResponse<Activity[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<Activity[]>>(this.activitiesUrl, {
      params: options,
    });
  }

  queryInput(req?: any): Observable<CustomResponse<ActivityInput[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<ActivityInput[]>>(
      this.activityInputUrl,
      {
        params: options,
      }
    );
  }

  getSubmittedAdminHierarchies(
    decisionLevelId: number,
    financialYearId: number,
    parentId: number,
    parentName: string,
    nextParent: string
  ): Observable<CustomResponse<AdminHierarchy[]>> {
    return this.http.get<CustomResponse<AdminHierarchy[]>>(
      `${this.scrutinizationUrl}/submitted_admin_hierarchies/${decisionLevelId}/${financialYearId}/${parentId}/${parentName}/${nextParent}`
    );
  }

  getSubmittedCostCentres(
    decisionLevelId: number,
    financialYearId: number,
    adminHierarchyId: number
  ): Observable<CustomResponse<Scrutinization[]>> {
    return this.http.get<CustomResponse<Scrutinization[]>>(
      `${this.scrutinizationUrl}/submitted_cost_centres/${decisionLevelId}/${financialYearId}/${adminHierarchyId}`
    );
  }
}
