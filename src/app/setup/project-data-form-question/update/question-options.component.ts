import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";

import { CustomResponse } from "../../../utils/custom-response";
import { ProjectDataFormQuestionOption } from "src/app/setup/project-data-form-question/project-data-form-question.model";
import { ProjectDataFormService } from "src/app/setup/project-data-form/project-data-form.service";
import { ProjectDataFormQuestion } from "../project-data-form-question.model";
import { ProjectDataFormQuestionService } from "../project-data-form-question.service";
import { ToastService } from "src/app/shared/toast.service";
import { EnumService, PlanrepEnum } from 'src/app/shared/enum.service';


@Component({
  selector: "app-question-options-component",
  templateUrl: "./question-options.component.html",
})

export class QuestionOptionsComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];
  disabled: boolean = true;
  questionValue:any

  options?: ProjectDataFormQuestionOption[] = [];
  optionsToEdit!: ProjectDataFormQuestionOption[];


  cols = [
    {
      field: "label",
      header: "label",
      sort: true,
    },
    {
      field: "option_value",
      header: "Value",
      sort: true,
    },
    {
      field: "is_active",
      header: "Is Active",
      sort: false,
    },
  ]; //Table display columns

  isLoading = false;
  clonedOptions: { [s: number]: ProjectDataFormQuestionOption; } = {};



  /**
   * Declare form
   */
  questionForm = this.fb.group({
    id: [null, []],
    name: [null, []],
    label: [null, [Validators.required]],
    option_value: [null, [Validators.required]],
    project_data_form_question_id: [null, [Validators.required]],
    is_active: [true, []],
  });


  constructor(
    protected projectDataFormQuestionService: ProjectDataFormQuestionService,
    protected projectDataFormService: ProjectDataFormService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService,
    protected enumService: EnumService

  ) {}

  ngOnInit(): void {

    this.fetchOptions();
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }

  fetchOptions() {
    this.projectDataFormQuestionService
      .getQuestions({ columns: ["id", "label","option_value"],project_data_form_question_id:this.dialogConfig.data.id })
      .subscribe(
        (resp: CustomResponse<ProjectDataFormQuestionOption[]>) =>
          (this.options = resp.data)
      );
  }

  save(): void {
    if (this.questionForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    var projectDataFormQuestionOption = this.createFromForm();
    delete projectDataFormQuestionOption.name;

    if (projectDataFormQuestionOption.id !== undefined && projectDataFormQuestionOption.id !== null) {
      this.subscribeToSaveResponse(
        this.projectDataFormQuestionService.updateQuestionOption(projectDataFormQuestionOption)
      );
    } else {
      this.subscribeToSaveResponse(
        this.projectDataFormQuestionService.createQuestionOption(projectDataFormQuestionOption)
      );
    }
  }


  /**
   * Set/Initialize form values
   * @param peSubForm
   */
  protected updateForm(projectDataFormQuestion: ProjectDataFormQuestion): void {
    this.questionValue = projectDataFormQuestion.name;
    this.questionForm.patchValue({
      project_data_form_question_id: projectDataFormQuestion.id,
    });
  }

  protected createFromForm(): ProjectDataFormQuestionOption {
    return {
      ...new ProjectDataFormQuestionOption(),
       name: this.questionForm.get(['name'])!.value,
      label: this.questionForm.get(['label'])!.value,
      option_value: this.questionForm.get(['option_value'])!.value,
      project_data_form_question_id: this.questionForm.get(['project_data_form_question_id'])!.value,
      is_active: this.questionForm.get(['is_active'])!.value,
    };
  }


  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<ProjectDataFormQuestionOption>>
  ): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      (result) => this.onSaveSuccess(result),
      (error) => this.onSaveError(error)
    );
  }

  protected onSaveError(error: any): void {}

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }


  /**
   * When save successfully close dialog and display info message
   * @param result
   */
  protected onSaveSuccess(result: any): void {
    this.toastService.info(result.message);
    this.questionForm.reset()
    this.fetchOptions();
    this.ngOnInit();
  }

  onRowEditInit(projectDataFormQuestionOption: ProjectDataFormQuestionOption) {
    this.clonedOptions[projectDataFormQuestionOption?.id!] = {...projectDataFormQuestionOption};
  }

  onRowEditSave(projectDataFormQuestionOption: ProjectDataFormQuestionOption) {
    this.subscribeToSaveResponse(
      this.projectDataFormQuestionService.updateQuestionOption(projectDataFormQuestionOption)
    );
  }

  onRowEditCancel(data: ProjectDataFormQuestionOption, index: number) {
    this.optionsToEdit[index] = this.clonedOptions[data.id!];
    delete this.clonedOptions[data.id!];
  }


}
