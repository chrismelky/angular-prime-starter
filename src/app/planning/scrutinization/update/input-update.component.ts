import {Component, OnInit} from "@angular/core";
import {UserService} from "../../../setup/user/user.service";
import {ScrutinizationService} from "../scrutinization.service";
import {AdminHierarchyService} from "../../../setup/admin-hierarchy/admin-hierarchy.service";
import {SectionService} from "../../../setup/section/section.service";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {FormBuilder, Validators} from "@angular/forms";
import {ToastService} from "../../../shared/toast.service";
import {User} from "../../../setup/user/user.model";
import {AdminHierarchy} from "../../../setup/admin-hierarchy/admin-hierarchy.model";
import {Section} from "../../../setup/section/section.model";
import {Observable} from "rxjs";
import {CustomResponse} from "../../../utils/custom-response";
import {Scrutinization} from "../scrutinization.model";
import {finalize} from "rxjs/operators";

@Component({
  selector: 'app-input-update',
  templateUrl: './input-update.component.html',
})
export class InputUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];
  currentUser!: User;
  adminHierarchies?: AdminHierarchy[] = [];
  sections?: Section[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    comments: [null, [Validators.required]],
  });
  constructor(
    protected userService: UserService,
    protected scrutinizationService: ScrutinizationService,
    protected adminHierarchyService: AdminHierarchyService,
    protected sectionService: SectionService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {
    this.currentUser = userService.getCurrentUser();
  }
  ngOnInit(): void {
    this.updateForm(this.dialogConfig.data);
  }
  saveOrUpdateInputComment(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    let data = {
      admin_hierarchy_level_id:this.currentUser.admin_hierarchy?.admin_hierarchy_position,
      financial_year_id:this.currentUser.admin_hierarchy?.current_financial_year_id,
      comments:this.editForm.value.comments,
      activity_input_id:this.dialogConfig.data.id
    }
    this.isSaving = true;
    this.scrutinizationService.createInputComment(data).subscribe(resp => {
      this.toastService.info(resp.message);
      this.dialogRef.close(true);
      this.isSaving = false;
    });
  }

  /**
   * When form is valid Create Scrutinization or Update Facility type if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const scrutinization = this.createFromForm();
    if (scrutinization.id !== undefined) {
      this.subscribeToSaveResponse(
        this.scrutinizationService.update(scrutinization)
      );
    } else {
      this.subscribeToSaveResponse(
        this.scrutinizationService.create(scrutinization)
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<Scrutinization>>
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
  protected onSaveError(error: any): void {}

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  /**
   * Set/Initialize form values
   * @param scrutinization
   */
  protected updateForm(scrutinization: Scrutinization): void {
    this.editForm.patchValue({
      id: scrutinization.id,
      comments: scrutinization.comments,
    });
  }

  /**
   * Return form values as object of type Scrutinization
   * @returns Scrutinization
   */
  protected createFromForm(): Scrutinization {
    return {
      ...new Scrutinization(),
      id: this.editForm.get(['id'])!.value,
      comments: this.editForm.get(['comments'])!.value,
    };
  }
}
