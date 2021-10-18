/**
 * @license
 * Copyright TAMISEMI All Rights Reserved.
 *
 * Use of this source code is governed by an Apache-style license that can be
 * found in the LICENSE file at https://tamisemi.go.tz/license
 */
import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {combineLatest, Observable} from "rxjs";
import { ConfirmationService, LazyLoadEvent, MenuItem } from "primeng/api";
import { DialogService } from "primeng/dynamicdialog";
import { Paginator } from "primeng/paginator";
import { Table } from "primeng/table";

import { CustomResponse } from "../../utils/custom-response";
import {
  ITEMS_PER_PAGE,
  PER_PAGE_OPTIONS,
} from "../../config/pagination.constants";
import { HelperService } from "src/app/utils/helper.service";
import { ToastService } from "src/app/shared/toast.service";
import { EnumService, PlanrepEnum } from "src/app/shared/enum.service";

import { ConfigurationSetting } from "./configuration-setting.model";
import { ConfigurationSettingService } from "./configuration-setting.service";
import { ConfigurationSettingUpdateComponent } from "./update/configuration-setting-update.component";
import {finalize} from "rxjs/operators";

@Component({
  selector: "app-configuration-setting",
  templateUrl: "./configuration-setting.component.html",
  styleUrls: ['./configuration-setting.component.scss']
})
export class ConfigurationSettingComponent implements OnInit {
  @ViewChild("paginator") paginator!: Paginator;
  @ViewChild("table") table!: Table;
  configurationSettings?: ConfigurationSetting[] = [];

  valueTypes?: PlanrepEnum[] = [];
  activeIndex: number = 0;
  groupData : any[]=[];
  value: any[] = [];


  cols = [
    {
      field: "key",
      header: "Key",
      sort: true,
    },
    {
      field: "value",
      header: "Value",
      sort: true,
    },
    {
      field: "name",
      header: "Name",
      sort: true,
    },
    {
      field: "group_name",
      header: "Group Name",
      sort: true,
    },
    {
      field: "value_type",
      header: "Value Type",
      sort: false,
    },
    {
      field: "value_options",
      header: "Value Options",
      sort: false,
    },
    {
      field: "value_option_query",
      header: "Value Option Query",
      sort: false,
    },
  ]; //Table display columns

  isLoading = false;
  page?: number = 1;
  per_page!: number;
  totalItems = 0;
  perPageOptions = PER_PAGE_OPTIONS;
  predicate!: string; //Sort column
  ascending!: boolean; //Sort direction asc/desc
  search: any = {}; // items search objects
  items: MenuItem[] = [];
  activeItem: MenuItem | undefined;

  //Mandatory filter

  constructor(
    protected configurationSettingService: ConfigurationSettingService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected confirmationService: ConfirmationService,
    protected dialogService: DialogService,
    protected helper: HelperService,
    protected toastService: ToastService,
    protected enumService: EnumService
  ) {}

  ngOnInit(): void {
    this.valueTypes = this.enumService.get("valueTypes");
    this.loadPage();
  }

  /**
   * Load data from api
   * @param page = page number
   * @param dontNavigate = if after successfully update url params with pagination and sort info
   */
  loadPage(): void {
    this.configurationSettingService
      .groups()
      .subscribe(
        (res: CustomResponse<any[]>) => {
          this.items = res.data!;
          this.handleChange(0);
        }
      );
  }

  /**
   * Called initialy/onInit to
   * Restore page, sort option from url query params if exist and load page
   */
  protected handleNavigation(): void {
    combineLatest([
      this.activatedRoute.data,
      this.activatedRoute.queryParamMap,
    ]).subscribe(([data, params]) => {
      const page = params.get("page");
      const perPage = params.get("per_page");
      const sort = (params.get("sort") ?? data["defaultSort"]).split(":");
      const predicate = sort[0];
      const ascending = sort[1] === "asc";
      this.per_page = perPage !== null ? parseInt(perPage) : ITEMS_PER_PAGE;
      this.page = page !== null ? parseInt(page) : 1;
      if (predicate !== this.predicate || ascending !== this.ascending) {
        this.predicate = predicate;
        this.ascending = ascending;
      }
      this.loadPage();
    });
  }

  /**
   * search items by @var search params
   */
  onSearch(): void {
    if (this.page !== 1) {
      this.paginator.changePage(0);
    } else {
      this.handleChange(this.activeIndex);
    }
  }

  /**
   * Clear search params
   */
  clearSearch(): void {
    this.search = {};
    if (this.page !== 1) {
      this.paginator.changePage(0);
    } else {
      this.handleChange(this.activeIndex);
    }
  }

  /**
   * Sorting changed
   * predicate = column to sort by
   * ascending = sort ascending else descending
   * @param $event
   */
  onSortChange($event: LazyLoadEvent): void {
    if ($event.sortField) {
      this.predicate = $event.sortField!;
      this.ascending = $event.sortOrder === 1;
      this.handleChange(this.activeIndex);
    }
  }

  /**
   * When page changed
   * @param event page event
   */
  pageChanged(event: any): void {
    this.page = event.page + 1;
    this.per_page = event.rows!;
    this.handleChange(this.activeIndex);
  }

  /**
   * Impletement sorting Set/Reurn the sorting option for data
   * @returns dfefault ot id sorting
   */
  protected sort(): string[] {
    const predicate = this.predicate ? this.predicate : "id";
    const direction = this.ascending ? "asc" : "desc";
    return [`${predicate}:${direction}`];
  }

  /**
   * Creating or updating ConfigurationSetting
   * @param configurationSetting ; If undefined initize new model to create else edit existing model
   */
  createOrUpdate(configurationSetting?: ConfigurationSetting): void {
    const data: ConfigurationSetting = configurationSetting ?? {
      ...new ConfigurationSetting(),
    };
    const ref = this.dialogService.open(ConfigurationSettingUpdateComponent, {
      data,
      header: "Create/Update ConfigurationSetting",
    });
    ref.onClose.subscribe((result) => {
      if (result) {
        this.handleChange(this.activeIndex);
      }
    });
  }

  /**
   * Delete ConfigurationSetting
   * @param configurationSetting
   */
  delete(configurationSetting: ConfigurationSetting): void {
    this.confirmationService.confirm({
      message:
        "Are you sure that you want to delete this ConfigurationSetting?",
      accept: () => {
        this.configurationSettingService
          .delete(configurationSetting.id!)
          .subscribe((resp) => {
            this.loadPage();
            this.toastService.info(resp.message);
          });
      },
    });
  }

  /**
   * When successfully data loaded
   * @param resp
   * @param page
   * @param navigate
   */
  protected onSuccess(
    resp: CustomResponse<ConfigurationSetting[]> | null,
    page: number,
    navigate: boolean
  ): void {
    this.totalItems = resp?.total!;
    this.page = page;
    if (navigate) {
      this.router.navigate(["/configuration-setting"], {
        queryParams: {
          page: this.page,
          per_page: this.per_page,
          sort:
            this.predicate ?? "id" + ":" + (this.ascending ? "asc" : "desc"),
        },
      });
    }
    this.configurationSettings = resp?.data ?? [];
  }

  /**
   * When error on loading data set data to empty and reset page to load
   */
  protected onError(): void {
    setTimeout(() => (this.table.value = []));
    this.page = 1;
    this.toastService.error("Error loading Configuration Setting");
  }

   handleChange(index:number) : void{
    this.activeIndex = index;
    const groupName = this.items[index].label;
     this.configurationSettingService
       .config_setting({group_name:groupName})
       .subscribe(
         (res: CustomResponse<ConfigurationSetting[]>) => {
           this.groupData = res.data!;
           this.groupData = this.groupData.filter(function(data) {
             if(data.options){
               let options  = data.options!.map((option: { value: any; name: any; }) => {
                 return {value:String(option.value),name:String(option.name)}
               });
                data.options = options;
                return data;
             }else{
               return data ;
             }
           });
         }
       );
  }

  updateValue(item:any){
    item.value = item.html_type === "MULT_SELECT"?item.multselected.map((x: any)=>x).join(","):item.value;
    const configurationSetting = this.createFromForm(item);
    this.subscribeToSaveResponse(
      this.configurationSettingService.update(configurationSetting)
    );
  }

  clear(table: Table) {
    table.clear();
  }

  /**
   * Return form values as object of type ConfigurationSetting
   * @returns ConfigurationSetting
   */
  protected createFromForm(configurationSetting:ConfigurationSetting): ConfigurationSetting {
    return {
      ...new ConfigurationSetting(),
      id: configurationSetting.id,
      key: configurationSetting.key,
      value: configurationSetting.value,
      name: configurationSetting.name,
      group_name: configurationSetting.group_name,
      value_type: configurationSetting.value_type,
      html_type:configurationSetting.html_type,
      value_options: configurationSetting.value_options,
      value_option_query: configurationSetting.value_option_query,
    };
  }

  protected subscribeToSaveResponse(
    result: Observable<CustomResponse<ConfigurationSetting>>
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
    this.handleChange(this.activeIndex);
  }

  /**
   * Error handling specific to this component
   * Note; general error handling is done by ErrorInterceptor
   * @param error
   */
  protected onSaveError(error: any): void {}

  protected onSaveFinalize(): void {
  }
}
