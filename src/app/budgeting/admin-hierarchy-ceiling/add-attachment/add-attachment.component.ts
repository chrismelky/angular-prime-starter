import {Component, ComponentFactoryResolver, OnInit, QueryList, ViewChildren, ViewContainerRef} from '@angular/core';
import {AdminHierarchy} from "../../../setup/admin-hierarchy/admin-hierarchy.model";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {AdminHierarchyService} from "../../../setup/admin-hierarchy/admin-hierarchy.service";
import {CustomResponse} from "../../../utils/custom-response";
import {AdminHierarchyCeilingService} from "../admin-hierarchy-ceiling.service";
import {Observable} from "rxjs";
import {finalize} from "rxjs/operators";
import {ToastService} from "../../../shared/toast.service";
import {Attachment} from "./Attachment.model";
import {ConfirmationService} from "primeng/api";
import {FormBuilder, Validators} from "@angular/forms";

@Component({
  selector: 'app-add-attachment',
  templateUrl: './add-attachment.component.html',
  styleUrls: ['./add-attachment.component.scss']
})
export class AddAttachmentComponent implements OnInit {
  uploadedFiles: any[] = [];
  councilCeilingDocs: any [] = [];
  councils: AdminHierarchy[] = [];
  selectedFile: Attachment = {};
  selectedCouncils: number[] = [];
  selectedCouncilsToFile: number[]=[];
  is_multiple: boolean;
  admin_hierarchy_id!: number;
  financial_year_id!: number;
  ceilingStartPosition!: number;
  councilWithAttachment: any[] =[];
  budget_type!:string;

  editForm = this.fb.group({
    councils: [null, [Validators.required]],
    file: [null, [Validators.required]],
    financial_year_id:[null, [Validators.required]],
    budget_type:[null, [Validators.required]],
    document_url:[null, []],
  });

  constructor(
    public dialogRef: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public adminHierarchyService: AdminHierarchyService,
    public adminHierarchyCeilingService: AdminHierarchyCeilingService,
    protected toastService: ToastService,
    protected confirmationService: ConfirmationService,
    protected fb: FormBuilder,
  ) {
    this.is_multiple=this.config.data.is_multiple;
    this.admin_hierarchy_id =this.config.data.admin_hierarchy_id;
    this.financial_year_id = this.config.data.financial_year_id;
    this.ceilingStartPosition = this.config.data.ceilingStartPosition;
    this.budget_type = this.config.data.budget_type;
  }

  ngOnInit(): void {
    this.editForm.patchValue({
      budget_type:this.budget_type,
      financial_year_id:this.financial_year_id
    });
    this.loadData();
  }
  loadData(){
    this.adminHierarchyService
      .query({parent_id:this.admin_hierarchy_id,admin_hierarchy_position:this.ceilingStartPosition})
      .subscribe(
        (resp: CustomResponse<AdminHierarchy[]>) =>{
          let councils = (resp.data ?? []);
          if(councils.length === 0){
            this.selectedCouncils = [this.admin_hierarchy_id];
            this.editForm.get("councils")?.setValue(this.selectedCouncils);
          }
          this.councilWithAttachment = councils.length>0?councils.map((c)=>(c.id)):[this.admin_hierarchy_id];
          this.adminHierarchyCeilingService
            .ceilingDocsByAdminHierarchies({admin_hierarchy_ids:this.councilWithAttachment,budget_type:this.budget_type,financial_year_id:this.financial_year_id,per_page:1000})
            .subscribe(
              (resp: CustomResponse<any[]>) =>{
                let fileObj = this.groupArrayOfObjects((resp.data ?? []),"document_url");
                this.councilCeilingDocs = Object.keys(fileObj).map(function(fileNameIndex){let file = fileObj[fileNameIndex];return {path:fileNameIndex,files:file};});
                this.councils = councils.filter((c)=>!(resp.data ?? []).map((f)=>(f.admin_hierarchy_id)).includes(c.id));
              }
            );

        }
      );
  }



  onUpload(event:any) {
    const $ceilingDocs = this.createFromForm();
    this.subscribeToSaveResponse(
      this.adminHierarchyCeilingService.createNewCeilingDocs($ceilingDocs)
    );
  }

  councilSelectionChange(councils:number){
    this.editForm.get("councils")?.setValue(councils);
  }

  addAttachment(table:any,event:any,row:any){
    this.selectedFile = row;
    table.toggle(event);
  }

   groupArrayOfObjects(list: any[], key: string ) {
    return list.reduce(function(rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  }

  onSelect(event: any) {
    // @ts-ignore
    if (event.files?.length)
      this.editForm.patchValue({
        file: event.files[0],
      });
  }

  addCouncilsToAttachment(){
    let payload ={
      admin_hierarchies:this.selectedCouncilsToFile,
      file:{
        admin_hierarchy_id:this.selectedFile.admin_hierarchy_id,
        financial_year_id:this.selectedFile.financial_year_id,
        budget_type:this.selectedFile.budget_type,
        document_url:this.selectedFile.document_url,
      }
    }
    this.subscribeToSaveResponse(
      this.adminHierarchyCeilingService.createAdminCeilingDocs(payload)
    );
  }


  public subscribeToSaveResponse(
    result: Observable<CustomResponse<any>>
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
    this.loadData();
    this.toastService.info(result.message);
    this.dialogRef.close(result.data);
  }

  /**
   * Error handling specific to this component
   * Note; general error handling is done by ErrorInterceptor
   * @param error
   */
  protected onSaveError(error: any): void {
    this.toastService.error(error.message);
  }

  protected onSaveFinalize(): void {
  }

  delete(row:any,event:any){
    this.confirmationService.confirm({
      target: event.target,
      icon: 'pi pi-exclamation-triangle',
      message:
        'Are you sure that you want to delete this Document?',
      accept: () => {
        this.adminHierarchyCeilingService
          .deleteCeilingDocs(row.id!)
          .subscribe((resp) => {
            this.loadData();
            this.toastService.info(resp.message);
          });
      },
    });
  }

  /**
   * Return form values as object
   * @returns StrategicPlan
   */
  protected createFromForm(): FormData {
    const fd = new FormData();
    fd.append(
      'financial_year_id',
      this.editForm.get(['financial_year_id'])!.value
    );
    fd.append('budget_type', this.editForm.get(['budget_type'])!.value);
    fd.append('document_url', this.editForm.get(['document_url'])!.value);
    fd.append('file', this.editForm.get(['file'])!.value);
    fd.append('councils', this.editForm.get(['councils'])!.value);
    return fd;
  }
}
