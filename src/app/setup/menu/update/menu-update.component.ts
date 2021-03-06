/**  * @license */
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { CustomResponse } from '../../../utils/custom-response';
import { Menu } from '../menu.model';
import { MenuService } from '../menu.service';
import { ToastService } from 'src/app/shared/toast.service';

@Component({
  selector: 'app-menu-update',
  templateUrl: './menu-update.component.html',
})
export class MenuUpdateComponent implements OnInit {
  isSaving = false;
  formError = false;
  errors = [];

  parents?: Menu[] = [];

  /**
   * Declare form
   */
  editForm = this.fb.group({
    id: [null, []],
    label: [null, [Validators.required]],
    icon: ['pi pi-fw pi-link', []],
    separator: [false, []],
    router_link: [''],
    parent_id: [null, []],
    sort_order: [0, [Validators.required]],
  });

  constructor(
    protected menuService: MenuService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig,
    protected fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    const menu = this.dialogConfig.data;

    this.updateForm(menu); //Initialize form with data from dialog
    this.menuService
      .query({
        columns: ['id', 'label', 'router_link', 'parent_id'],
        with: ['parent', 'parent.parent', 'parent.parent.parent'],
      })
      .subscribe((resp: CustomResponse<Menu[]>) => {
        this.parents = menu.id
          ? (this.parents = resp.data?.filter((m) => m.id !== menu.id))
          : resp.data;
      });
  }

  /**
   * When form is valid Create Menu or Update if exist else set form has error and return
   * @returns
   */
  save(): void {
    if (this.editForm.invalid) {
      this.formError = true;
      return;
    }
    this.isSaving = true;
    const menu = this.createFromForm();
    const payload = {
      id: menu.id,
      label: menu.label,
      icon: menu.icon,
      code: menu.label + '_' + menu.parent_id,
      parent_id: menu.parent_id,
      sort_order: menu.sort_order,
      router_link: menu.router_link,
      separator: menu.separator,
    } as Menu;
    if (menu.id !== undefined) {
      this.subscribeToSaveResponse(this.menuService.update(payload));
    } else {
      this.subscribeToSaveResponse(this.menuService.create(payload));
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<Menu>>
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
   * @param menu
   */
  protected updateForm(menu: Menu): void {
    this.editForm.patchValue({
      id: menu.id,
      label: menu.label,
      icon: menu.icon,
      separator: menu.separator,
      router_link: menu.router_link,
      parent_id: menu.parent_id,
      sort_order: menu.sort_order,
    });
  }

  /**
   * Return form values as object of type Menu
   * @returns Menu
   */
  protected createFromForm(): Menu {
    return {
      ...new Menu(),
      id: this.editForm.get(['id'])!.value,
      label: this.editForm.get(['label'])!.value,
      icon: this.editForm.get(['icon'])!.value,
      separator: this.editForm.get(['separator'])!.value,
      router_link: this.editForm.get(['router_link'])!.value,
      parent_id: this.editForm.get(['parent_id'])!.value,
      sort_order: this.editForm.get(['sort_order'])!.value,
    };
  }
}
