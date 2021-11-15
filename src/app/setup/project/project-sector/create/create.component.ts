import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Project } from '../../project.model';
import { ProjectSectorService } from '../../../project-sector/project-sector.service';
import { ToastService } from '../../../../shared/toast.service';
import { Sector } from '../../../sector/sector.model';
import { SectorService } from '../../../sector/sector.service';
import {
  CreateProjectSector,
  ProjectSector,
} from '../../../project-sector/project-sector.model';
import { CustomResponse } from '../../../../utils/custom-response';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';

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
  sectors?: Sector[] = [];
  /**
   * Declare form
   */
  editForm = this.fb.group({
    sectors: [null, [Validators.required]],
  });

  constructor(
    protected projectSectorService: ProjectSectorService,
    protected sectorService: SectorService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {
    this.project = dialogConfig.data.project;
  }

  ngOnInit(): void {
    this.loadSectors();
  }

  loadSectors() {
    this.sectorService
      .query({ columns: ['id', 'name'] })
      .subscribe(
        (resp: CustomResponse<Sector[]>) => (this.sectors = resp.data)
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
      this.projectSectorService.addMultipleSectors(data)
    );
  }

  /**
   *
   * @param result
   * @protected
   */
  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<ProjectSector[]>>
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
  protected createFromForm(): CreateProjectSector {
    return {
      ...new CreateProjectSector(),
      sectors: this.editForm.get(['sectors'])!.value,
    };
  }
}
