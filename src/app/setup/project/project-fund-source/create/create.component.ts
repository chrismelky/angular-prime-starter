import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {
  CreateProjectFundSource,
  ProjectFundSource,
} from '../../../project-fund-source/project-fund-source.model';
import { Project } from '../../project.model';
import { FundSource } from '../../../fund-source/fund-source.model';
import { ToastService } from '../../../../shared/toast.service';
import { ProjectFundSourceService } from '../../../project-fund-source/project-fund-source.service';
import { FundSourceService } from '../../../fund-source/fund-source.service';
import { CustomResponse } from '../../../../utils/custom-response';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];
  project: Project | undefined;
  fundSources?: FundSource[] = [];
  /**
   * Declare form
   */
  editForm = this.fb.group({
    fundSources: [null, [Validators.required]],
  });

  constructor(
    protected projectFundSourceService: ProjectFundSourceService,
    protected fundSourceService: FundSourceService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {
    this.project = dialogConfig.data.project;
  }

  ngOnInit(): void {
    this.loadFundSources();
  }

  loadFundSources() {
    this.fundSourceService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<FundSource[]>) => (this.fundSources = resp.data)
      );
  }

  /**
   * When form is valid Create UserProject or Update if exist else set form has error and return
   * @returns
   */
  save(): void {
    this.isSaving = true;
    const data = this.createFromForm();
    data.project_id = this.project?.id;
    this.subscribeToSaveResponse(
      this.projectFundSourceService.addMultipleFundSources(data)
    );
  }

  /**
   *
   * @param result
   * @protected
   */
  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<ProjectFundSource[]>>
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
   * Return form values as object of type UserProject
   * @returns UserProject
   */
  protected createFromForm(): CreateProjectFundSource {
    return {
      ...new CreateProjectFundSource(),
      fund_sources: this.editForm.get(['fundSources'])!.value,
    };
  }
}
