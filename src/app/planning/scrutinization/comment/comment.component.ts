import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ToastService } from 'src/app/shared/toast.service';
import { CustomResponse } from 'src/app/utils/custom-response';
import { ScrutinizationService } from '../scrutinization.service';
import { Comment } from './comment.model';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
})
export class CommentComponent implements OnInit {
  otherComments: Comment[] = [];

  editForm = this.fb.group({
    id: [],
    scrutinization_id: [null, [Validators.required]],
    admin_hierarchy_cost_centre_id: [null, [Validators.required]],
    admin_hierarchy_id: [null, [Validators.required]],
    section_id: [null, [Validators.required]],
    financial_year_id: [null, [Validators.required]],
    commentable_id: [null, [Validators.required]],
    commentable_type: [null, [Validators.required]],
    comments: [null, [Validators.required]],
  });
  formError: boolean = false;
  isSaving: boolean = false;

  constructor(
    protected scrutinizationService: ScrutinizationService,
    protected fb: FormBuilder,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    const dialogData = this.dialogConfig.data;
    this.otherComments = dialogData.otherComments;
    this.updateForm(dialogData.currentComment); //Initialize form with data from dialog
  }

  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const comment = this.createFromForm();
    if (comment.id !== undefined) {
      this.subscribeToSaveResponse(
        this.scrutinizationService.updateComment(comment)
      );
    } else {
      this.subscribeToSaveResponse(
        this.scrutinizationService.createComment(comment)
      );
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<Comment>>
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
    this.otherComments.unshift(result.data);
    this.dialogRef.close(this.otherComments);
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
   * @param comment
   */
  protected updateForm(comment: Comment): void {
    this.editForm.patchValue({
      id: comment.id,
      scrutinization_id: comment.scrutinization_id,
      admin_hierarchy_cost_centre_id: comment.admin_hierarchy_cost_centre_id,
      admin_hierarchy_id: comment.admin_hierarchy_id,
      section_id: comment.section_id,
      financial_year_id: comment.financial_year_id,
      commentable_id: comment.commentable_id,
      commentable_type: comment.commentable_type,
      comments: comment.comments,
    });
  }

  /**
   * Return form values as object of type Scrutinization
   * @returns Scrutinization
   */
  protected createFromForm(): Comment {
    return {
      ...new Comment(),
      ...this.editForm.value,
    };
  }
}
