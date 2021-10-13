import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OverlayPanel } from 'primeng/overlaypanel';
import { ToastService } from 'src/app/shared/toast.service';
import { FinancialYear } from '../../../setup/financial-year/financial-year.model';
import { FinancialYearTarget } from '../financial-year-target.model';
import { FinancialYearTargetService } from '../financial-year-target.service';
import { LongTermTarget } from '../long-term-target.model';

@Component({
  selector: 'app-financial-year-target-view',
  templateUrl: './financial-year-target-view.component.html',
  styleUrls: ['./financial-year-target-view.component.scss'],
})
export class FinancialYearTargetViewComponent implements OnInit {
  @Input() longTermTarget?: LongTermTarget;
  @Input() financialYearId?: number;
  @Input() currentFinancialYear?: FinancialYear;
  @Input() adminHierarchyId?: number;
  @ViewChild('op') op?: TemplateRef<OverlayPanel>;
  @Output() onSave: EventEmitter<any> = new EventEmitter();

  editForm: FormGroup = this.fb.group({
    description: [null, []],
  });
  formError = false;
  isSaving = false;
  isLoading = false;
  constructor(
    protected fyTargetService: FinancialYearTargetService,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {}

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {}

  loadTarget(): void {
    if (this.currentFinancialYear?.id === this.financialYearId) {
      this.updateForm(
        this.longTermTarget?.financial_year_target || {
          ...new FinancialYearTarget(),
          long_term_target_id: this.longTermTarget?.id,
          section_id: this.longTermTarget?.section_id,
          financial_year_id: this.financialYearId,
          admin_hierarchy_id: this.adminHierarchyId,
          code: this.longTermTarget?.code,
        },
        true
      );
    } else {
      this.isLoading = true;
      this.fyTargetService
        .findOneBy(
          this.longTermTarget?.id!,
          this.financialYearId!,
          this.longTermTarget?.section_id!
        )
        .subscribe(
          (resp) => {
            this.isLoading = false;
            this.updateForm(
              resp?.data || {
                ...new FinancialYearTarget(),
                long_term_target_id: this.longTermTarget?.id,
                section_id: this.longTermTarget?.section_id,
                financial_year_id: this.financialYearId,
                code: this.longTermTarget?.code,
                admin_hierarchy_id: this.adminHierarchyId,
              },
              false
            );
          },
          (error: HttpErrorResponse) => {
            this.isLoading = false;
          }
        );
    }
  }

  protected updateForm(target: FinancialYearTarget, active: boolean): void {
    this.editForm = this.fb.group({
      id: [target.id, []],
      description: [target.description, [Validators.required]],
      financial_year_id: [target.financial_year_id, [Validators.required]],
      long_term_target_id: [target.long_term_target_id, [Validators.required]],
      code: [target.code, [Validators.required]],
      section_id: [target.section_id, [Validators.required]],
      admin_hierarchy_id: [target.admin_hierarchy_id, [Validators.required]],
    });
  }

  /**
   * Return form values as object of type FinancialYearTarget
   * @returns FinancialYearTarget
   */
  protected createFromForm(): FinancialYearTarget {
    return {
      ...new FinancialYearTarget(),
      id: this.editForm.get(['id'])!.value,
      description: this.editForm.get(['description'])!.value,
      long_term_target_id: this.editForm.get(['long_term_target_id'])!.value,
      financial_year_id: this.editForm.get(['financial_year_id'])!.value,
      code: this.editForm.get(['code'])!.value,
      section_id: this.editForm.get(['section_id'])!.value,
      admin_hierarchy_id: this.editForm.get(['admin_hierarchy_id'])!.value,
    };
  }

  save(): void {
    const target = this.createFromForm();
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    if (target.id !== undefined && target.id !== null) {
      this.fyTargetService.update(target).subscribe(
        (resp) => this.onSaveSuccess(resp),
        (error) => this.onSaveError(error)
      );
    } else {
      this.fyTargetService.create(target).subscribe(
        (resp) => this.onSaveSuccess(resp),
        (error) => this.onSaveError(error)
      );
    }
  }

  /**
   * When save successfully close dialog and display info message
   * @param result
   */
  protected onSaveSuccess(result: any): void {
    this.toastService.info(result.message);
    this.onSave.next(result);
    this.op?.elementRef.nativeElement.hide();
  }

  /**
   * Error handling specific to this component
   * Note; general error handling is done by ErrorInterceptor
   * @param error
   */
  protected onSaveError(error: any): void {}
}
