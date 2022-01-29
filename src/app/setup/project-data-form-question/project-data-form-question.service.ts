/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

import { createRequestOption } from "../../utils/request-util";
import { CustomResponse } from "../../utils/custom-response";
import { ProjectDataFormQuestion,ProjectDataFormQuestionOption } from "./project-data-form-question.model";


@Injectable({ providedIn: "root" })
export class ProjectDataFormQuestionService {
  public resourceUrl = "api/project_data_form_questions";

  constructor(protected http: HttpClient) {}

  create(
    projectDataFormQuestion: ProjectDataFormQuestion
  ): Observable<CustomResponse<ProjectDataFormQuestion>> {
    return this.http.post<CustomResponse<ProjectDataFormQuestion>>(
      this.resourceUrl,
      projectDataFormQuestion
    );
  }

  update(
    projectDataFormQuestion: ProjectDataFormQuestion
  ): Observable<CustomResponse<ProjectDataFormQuestion>> {
    return this.http.put<CustomResponse<ProjectDataFormQuestion>>(
      `${this.resourceUrl}/${projectDataFormQuestion.id}`,
      projectDataFormQuestion
    );
  }

  find(id: number): Observable<CustomResponse<ProjectDataFormQuestion>> {
    return this.http.get<CustomResponse<ProjectDataFormQuestion>>(
      `${this.resourceUrl}/${id}`
    );
  }

  query(req?: any): Observable<CustomResponse<ProjectDataFormQuestion[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<ProjectDataFormQuestion[]>>(
      this.resourceUrl,
      { params: options }
    );
  }

  delete(id: number): Observable<CustomResponse<null>> {
    return this.http.delete<CustomResponse<null>>(`${this.resourceUrl}/${id}`);
  }


  getQuestions(req?: any): Observable<CustomResponse<ProjectDataFormQuestionOption[]>> {
    const options = createRequestOption(req);
    return this.http.get<CustomResponse<ProjectDataFormQuestionOption[]>>(
      "api/get_project_data_form_questions_options",
      { params: options }
    );
  }

  createQuestionOption(
    projectDataFormQuestionOption: ProjectDataFormQuestionOption
  ): Observable<CustomResponse<ProjectDataFormQuestionOption>> {
    return this.http.post<CustomResponse<ProjectDataFormQuestionOption>>(
      "api/create_project_data_form_questions_options",
      projectDataFormQuestionOption
    );
  }

  updateQuestionOption(
    projectDataFormQuestionOption: ProjectDataFormQuestionOption
  ): Observable<CustomResponse<ProjectDataFormQuestionOption>> {
    return this.http.put<CustomResponse<ProjectDataFormQuestionOption>>(
      `api/update_project_data_form_questions_options/${projectDataFormQuestionOption.id}`,
      projectDataFormQuestionOption
    );
  }

  questionWithOptions(id: number): Observable<CustomResponse<ProjectDataFormQuestion[]>> {
    return this.http.get<CustomResponse<ProjectDataFormQuestion[]>>(
      `api/project_data_form_questions_with_options/${id}`
    );
  }

}
