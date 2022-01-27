/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ProjectDataFormQuestionRoutingModule } from "./project-data-form-question-routing.module";

import { SharedModule } from "../../shared/shared.module";
import { ProjectDataFormQuestionComponent } from "./project-data-form-question.component";
import { ProjectDataFormQuestionUpdateComponent } from "./update/project-data-form-question-update.component";
import {QuestionOptionsComponent} from "./update/question-options.component";

@NgModule({
  imports: [SharedModule, CommonModule, ProjectDataFormQuestionRoutingModule],
  declarations: [
    ProjectDataFormQuestionComponent,
    ProjectDataFormQuestionUpdateComponent,
    QuestionOptionsComponent,
  ],
  entryComponents: [ProjectDataFormQuestionUpdateComponent,QuestionOptionsComponent],
})
export class ProjectDataFormQuestionModule {}
