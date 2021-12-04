import { Component, OnInit } from '@angular/core';
import { Section } from '../../../section/section.model';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { SectionService } from '../../../section/section.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ToastService } from '../../../../shared/toast.service';
import { CustomResponse } from '../../../../utils/custom-response';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { SectionLevelService } from '../../../section-level/section-level.service';
import { SectionLevel } from '../../../section-level/section-level.model';
import {GfsCode} from "../../gfs-code.model";
import {GfsCodeSectionService} from "../gfs-code-section.service";
import {CreateGfsCodeSection} from "../gfs-code-section.model";

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];
  gfsCode!: GfsCode;
  sections?: Section[] = [];
  sectionLevels?: SectionLevel[] = [];
  sectionLevelControl = new FormControl(null);
  sectionLevelPosition: number | undefined;
  /**
   * Declare form
   */
  editForm = this.fb.group({
    sections: [null, [Validators.required]],
  });

  constructor(
    protected gfsCodeSectionService: GfsCodeSectionService,
    protected sectionService: SectionService,
    protected sectionLevelService: SectionLevelService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {
    this.gfsCode = dialogConfig.data.gfsCode;
  }

  ngOnInit(): void {
    this.sectionLevelService
      .query({ columns: ['id', 'name', 'code', 'position'] })
      .subscribe(
        (resp: CustomResponse<SectionLevel[]>) =>
          (this.sectionLevels = resp.data)
      );
  }

  loadSections() {
    this.sectionLevelPosition = this.sectionLevelControl.value as number;
    this.sectionService
      .query({ columns: ['id', 'name'], position: this.sectionLevelPosition })
      .subscribe(
        (resp: CustomResponse<Section[]>) => (this.sections = resp.data)
      );
  }

  /**
   * When form is valid Create GfsCodeSection or Update if exist else set form has error and return
   * @returns
   */
  save(): void {
    this.isSaving = true;
    const data = this.createFromForm();
    data.gfs_code_id = this.gfsCode?.id;
    this.subscribeToSaveResponse(
      this.gfsCodeSectionService.addMultipleSections(data)
    );
  }

  /**
   *
   * @param result
   * @protected
   */
  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<null>>
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
   * Return form values as object of type GfsCodeSection
   * @returns GfsCodeSection
   */
  protected createFromForm(): CreateGfsCodeSection {
    return {
      ...new CreateGfsCodeSection(),
      sections: this.editForm.get(['sections'])!.value,
    };
  }
}
