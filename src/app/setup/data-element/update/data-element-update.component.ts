/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import {Component, Inject, OnInit} from "@angular/core";
import {FormBuilder, Validators} from "@angular/forms";
import {Observable} from "rxjs";
import {finalize} from "rxjs/operators";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";

import {CustomResponse} from "../../../utils/custom-response";
import {EnumService, PlanrepEnum} from "src/app/shared/enum.service";
import {DataSet} from "src/app/setup/data-set/data-set.model";
import {DataSetService} from "src/app/setup/data-set/data-set.service";
import {CategoryCombination} from "src/app/setup/category-combination/category-combination.model";
import {CategoryCombinationService} from "src/app/setup/category-combination/category-combination.service";
import {OptionSet} from "src/app/setup/option-set/option-set.model";
import {OptionSetService} from "src/app/setup/option-set/option-set.service";
import {DataElement} from "../data-element.model";
import {DataElementService} from "../data-element.service";
import {ToastService} from "src/app/shared/toast.service";

@Component({
  selector: "app-data-element-update",
  templateUrl: "./data-element-update.component.html",
})
export class DataElementUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  dataSets?: DataSet[] = [];
  categoryCombinations?: CategoryCombination[] = [];
  optionSets?: OptionSet[] = [];
  valueTypes?: PlanrepEnum[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    name: [null, [Validators.required]],
    display_name: [null, [Validators.required]],
    code: [null, []],
    question_number: [null, []],
    data_set_id: [null, [Validators.required]],
    category_combination_id: [null, [Validators.required]],
    option_set_id: [null, [Validators.required]],
    sort_order: [null, []],
    value_type: [null, [Validators.required]],
    is_required: [false, []],
  });

  constructor(
    protected dataElementService: DataElementService,
    protected dataSetService: DataSetService,
    protected categoryCombinationService: CategoryCombinationService,
    protected optionSetService: OptionSetService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService,
    protected enumService: EnumService
  ) {
  }

  ngOnInit(): void {
    this.dataSetService
      .query({columns: ["id", "name"]})
      .subscribe(
        (resp: CustomResponse<DataSet[]>) => (this.dataSets = resp.data)
      );
    this.categoryCombinationService
      .query({columns: ["id", "name"]})
      .subscribe(
        (resp: CustomResponse<CategoryCombination[]>) =>
          (this.categoryCombinations = resp.data)
      );
    this.optionSetService
      .query({columns: ["id", "name"]})
      .subscribe(
        (resp: CustomResponse<OptionSet[]>) => (this.optionSets = resp.data)
      );
    this.valueTypes = this.enumService.get("valueTypes");
    this.updateForm(this.dialogConfig.data); //Initialize form with data from dialog
  }

  /**
   * When form is valid Create DataElement or Update Facility type if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const dataElement = this.createFromForm();
    if (dataElement.id !== undefined) {
      this.subscribeToSaveResponse(this.dataElementService.update(dataElement));
    } else {
      this.subscribeToSaveResponse(this.dataElementService.create(dataElement));
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<DataElement>>
  ): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      (result) => this.onSaveSuccess(result),
      (error) => this.onSaveError(error)
    );
  }

  /**
   * When save successfully close dialog and display info message
   * @param result
   */
  protected onSaveSuccess(result: any): void {
    this.toastService.info(result.message);
    this.dialogRef.close(true);
  }

  /**
   * Error handling specific to this component
   * Note; general error handling is done by ErrorInterceptor
   * @param error
   */
  protected onSaveError(error: any): void {
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  /**
   * Set/Initialize form values
   * @param dataElement
   */
  protected updateForm(dataElement: DataElement): void {
    this.editForm.patchValue({
      id: dataElement.id,
      name: dataElement.name,
      display_name: dataElement.display_name,
      code: dataElement.code,
      question_number: dataElement.question_number,
      data_set_id: dataElement.data_set_id,
      category_combination_id: dataElement.category_combination_id,
      option_set_id: dataElement.option_set_id,
      sort_order: dataElement.sort_order,
      value_type: dataElement.value_type,
      is_required: dataElement.is_required,
    });
  }

  /**
   * Return form values as object of type DataElement
   * @returns DataElement
   */
  protected createFromForm(): DataElement {
    return {
      ...new DataElement(),
      id: this.editForm.get(["id"])!.value,
      name: this.editForm.get(["name"])!.value,
      display_name: this.editForm.get(["display_name"])!.value,
      code: this.editForm.get(["code"])!.value,
      question_number: this.editForm.get(["question_number"])!.value,
      data_set_id: this.editForm.get(["data_set_id"])!.value,
      category_combination_id: this.editForm.get(["category_combination_id"])!
        .value,
      option_set_id: this.editForm.get(["option_set_id"])!.value,
      sort_order: this.editForm.get(["sort_order"])!.value,
      value_type: this.editForm.get(["value_type"])!.value,
      is_required: this.editForm.get(["is_required"])!.value,
    };
  }
}
