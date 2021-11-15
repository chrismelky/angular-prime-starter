import { Component, OnInit } from '@angular/core';
import { FacilityType } from '../../facility-type.model';
import { Section } from '../../../section/section.model';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { FacilityTypeSectionService } from '../facility-type-section.service';
import { SectionService } from '../../../section/section.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ToastService } from '../../../../shared/toast.service';
import { CustomResponse } from '../../../../utils/custom-response';
import { Observable } from 'rxjs';
import {
  CreateFacilityTypeSection,
  FacilityTypeSection,
} from '../facility-type-section.model';
import { finalize } from 'rxjs/operators';
import { SectionLevelService } from '../../../section-level/section-level.service';
import { SectionLevel } from '../../../section-level/section-level.model';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];
  facilityType: FacilityType | undefined;
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
    protected facilityTypeSectionService: FacilityTypeSectionService,
    protected sectionService: SectionService,
    protected sectionLevelService: SectionLevelService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {
    this.facilityType = dialogConfig.data.facility_type;
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
   * When form is valid Create FacilityTypeSection or Update if exist else set form has error and return
   * @returns
   */
  save(): void {
    this.isSaving = true;
    const data = this.createFromForm();
    data.facility_type_id = this.facilityType?.id;
    this.subscribeToSaveResponse(
      this.facilityTypeSectionService.addMultipleSections(data)
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
   * Return form values as object of type FacilityTypeSection
   * @returns FacilityTypeSection
   */
  protected createFromForm(): CreateFacilityTypeSection {
    return {
      ...new CreateFacilityTypeSection(),
      sections: this.editForm.get(['sections'])!.value,
    };
  }
}
