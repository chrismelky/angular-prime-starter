import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ToastService } from 'src/app/shared/toast.service';
import { CustomResponse } from 'src/app/utils/custom-response';
import { CategoryCategoryOption } from '../../category-category-option/category-category-option.model';
import { CategoryCategoryOptionService } from '../../category-category-option/category-category-option.service';
import { CategoryOption } from '../../category-option/category-option.model';
import { CategoryOptionService } from '../../category-option/category-option.service';

@Component({
  selector: 'app-option-update',
  templateUrl: './option-update.component.html',
  styleUrls: ['./option-update.component.scss'],
})
export class OptionUpdateComponent implements OnInit {
  @Input() category_id?: number;
  categoryOptions?: CategoryOption[] = [];
  categoryCategoryOptions?: CategoryCategoryOption[] = [];
  isSaving = false;
  formError = false;
  isLoading = false;

  cols = [
    {
      field: 'sort_order',
      header: 'Sort Order',
      sort: true,
    },
  ]; //Table display columns

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    category_id: [null, [Validators.required]],
    category_option_id: [null, [Validators.required]],
    sort_order: [null, [Validators.required]],
  });

  constructor(
    protected fb: FormBuilder,
    protected categoryCategoryOptionService: CategoryCategoryOptionService,
    protected categoryOptionService: CategoryOptionService,
    private toastService: ToastService,
    protected confirmationService: ConfirmationService
  ) {}

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {
    console.log('created' + this.category_id);
    this.categoryOptionService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<CategoryOption[]>) =>
          (this.categoryOptions = resp.data)
      );
  }

  loadCategoryCategoryOptions(): void {
    this.editForm.patchValue({
      category_id: this.category_id,
    });
    this.isLoading = true;
    this.categoryCategoryOptionService
      .query({
        category_id: this.category_id,
      })
      .subscribe(
        (resp) => {
          this.categoryCategoryOptions = resp.data;
          this.isLoading = false;
        },
        (error) => {
          this.isLoading = false;
        }
      );
  }

  onHide(): void {
    console.log('on hide');
    this.editForm.reset();
    this.editForm.markAsPristine();
    this.editForm.markAsUntouched();
    this.formError = false;
  }

  /**
   * When form is valid Create CategoryCategoryOption Update if exist else set form has error and return
   * @returns
   */
  createOrUpdate(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const categoryCategoryOption = this.createFromForm();
    console.log(categoryCategoryOption);
    if (categoryCategoryOption.id !== null) {
      this.subscribeToSaveResponse(
        this.categoryCategoryOptionService.update(categoryCategoryOption)
      );
    } else {
      this.subscribeToSaveResponse(
        this.categoryCategoryOptionService.create(categoryCategoryOption)
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<CategoryCategoryOption>>
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
    this.loadCategoryCategoryOptions();
  }

  /**
   * Error handling specific to this component
   * Note; general error handling is done by ErrorInterceptor
   * @param error
   */
  protected onSaveError(error: any): void {}

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  /**
   * Return form values as object of type CategoryCategoryOption
   * @returns CategoryCategoryOption
   */
  protected createFromForm(): CategoryCategoryOption {
    return {
      ...new CategoryCategoryOption(),
      id: this.editForm.get(['id'])!.value,
      category_id: this.editForm.get(['category_id'])!.value,
      category_option_id: this.editForm.get(['category_option_id'])!.value,
      sort_order: this.editForm.get(['sort_order'])!.value,
    };
  }

  /**
   * Delete CategoryCategoryOption
   * @param categoryCategoryOption
   */
  deleteOption(
    $event: any,
    categoryCategoryOption: CategoryCategoryOption
  ): void {
    this.confirmationService.confirm({
      message:
        'Are you sure that you want to delete this CategoryCategoryOption?',
      target: $event?.target,
      key: 'option',
      accept: () => {
        this.categoryCategoryOptionService
          .delete(categoryCategoryOption.id!)
          .subscribe((resp) => {
            this.loadCategoryCategoryOptions();
            this.toastService.info(resp.message);
          });
      },
    });
  }
}
