import {Component, Inject, OnInit} from "@angular/core";
import {FormBuilder, Validators} from "@angular/forms";
import {Observable} from "rxjs";
import {finalize} from "rxjs/operators";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";

import {CustomResponse} from "../../../utils/custom-response";
import {Sector} from "src/app/setup/sector/sector.model";
import {SectorService} from "src/app/setup/sector/sector.service";
import {SectionLevel} from "src/app/setup/section-level/section-level.model";
import {SectionLevelService} from "src/app/setup/section-level/section-level.service";
import {Section} from "../section.model";
import {SectionService} from "../section.service";
import {ToastService} from "src/app/shared/toast.service";

@Component({
  selector: "app-section-update",
  templateUrl: "./section-update.component.html",
})
export class SectionUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  sectors?: Sector[] = [];
  sectionLevels?: SectionLevel[] = [];
  parents?: Section[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    code: [null, [Validators.required]],
    name: [null, [Validators.required]],
    sector_id: [null, []],
    section_level_id: [null, [Validators.required]],
    parent_id: [null, [Validators.required]],
  });

  constructor(
    protected sectionService: SectionService,
    protected sectorService: SectorService,
    protected sectionLevelService: SectionLevelService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {
  }

  ngOnInit(): void {
    this.sectorService
      .query()
      .subscribe(
        (resp: CustomResponse<Sector[]>) => (this.sectors = resp.data)
      );
    this.sectionLevelService
      .query()
      .subscribe(
        (resp: CustomResponse<SectionLevel[]>) =>
          (this.sectionLevels = resp.data)
      );
    this.sectionService
      .query()
      .subscribe(
        (resp: CustomResponse<Section[]>) => (this.parents = resp.data)
      );
    this.updateForm(this.dialogConfig.data); //Initilize form with data from dialog
  }

  /**
   * When form is valid Create Section or Update Facilitiy type if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const section = this.createFromForm();
    if (section.id !== undefined) {
      this.subscribeToSaveResponse(this.sectionService.update(section));
    } else {
      this.subscribeToSaveResponse(this.sectionService.create(section));
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<Section>>
  ): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      (result) => this.onSaveSuccess(result),
      (error) => this.onSaveError(error)
    );
  }

  /**
   * When save successfully close dialog and dispaly info message
   * @param result
   */
  protected onSaveSuccess(result: any): void {
    this.toastService.info(result.message);
    this.dialogRef.close(true);
  }

  /**
   * Error handiling specific to this component
   * Note; general error handleing is done by ErrorInterceptor
   * @param error
   */
  protected onSaveError(error: any): void {
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  /**
   * Set/Initialize form values
   * @param section
   */
  protected updateForm(section: Section): void {
    this.editForm.patchValue({
      id: section.id,
      code: section.code,
      name: section.name,
      sector_id: section.sector_id,
      section_level_id: section.section_level_id,
      parent_id: section.parent_id,
    });
  }

  /**
   * Return form values as object of type Section
   * @returns Section
   */
  protected createFromForm(): Section {
    return {
      ...new Section(),
      id: this.editForm.get(["id"])!.value,
      code: this.editForm.get(["code"])!.value,
      name: this.editForm.get(["name"])!.value,
      sector_id: this.editForm.get(["sector_id"])!.value,
      section_level_id: this.editForm.get(["section_level_id"])!.value,
      parent_id: this.editForm.get(["parent_id"])!.value,
    };
  }
}
