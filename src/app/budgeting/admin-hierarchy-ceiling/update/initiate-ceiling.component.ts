import { CustomResponse } from '../../../utils/custom-response';
import { Section } from '../../../setup/section/section.model';
import { FundSourceBudgetClass } from '../../../setup/fund-source-budget-class/fund-source-budget-class.model';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FundSourceBudgetClassService} from "../../../setup/fund-source-budget-class/fund-source-budget-class.service";
import {Table} from "primeng/table";
import {fromEvent} from "rxjs";
import {debounceTime, distinctUntilChanged, filter, map, subscribeOn} from 'rxjs/operators';
import {DynamicDialogConfig} from 'primeng/dynamicdialog';
import {AdminHierarchy} from "../../../setup/admin-hierarchy/admin-hierarchy.model";
import {AdminHierarchyService} from "../../../setup/admin-hierarchy/admin-hierarchy.service";

@Component({
  selector: 'app-initiate-ceiling',
  templateUrl: './initiate-ceiling.component.html',
  styleUrls: ['./initiate-ceiling.component.scss'],
})
export class InitiateCeilingComponent implements OnInit {
  @ViewChild('ceilingSearchInput') ceilingSearchInput!: ElementRef<any>;
  ceilings?: any[] = [];
  selectedSource: any[]=[];
  filterValue: string='';
  isSearching:boolean=false;
  private existingCeiling: any;
  selectedAdminHierarchies: number[] = [];
  adminHierarchiesList: AdminHierarchy[]=[];
  activeAdminHierarchy: AdminHierarchy={};
  ceilingStartLevel!:number;
  parent_id!:number;
  position!:number;
  constructor(
    private fundSourceBudgetClassService:FundSourceBudgetClassService,
    public dialogRef: DynamicDialogRef,
    public config: DynamicDialogConfig,
    protected adminHierarchyService: AdminHierarchyService,

  ) { }

  ngAfterViewInit() {
    this.existingCeiling=this.config.data.ceiling;
    this.ceilingStartLevel=this.config.data.ceilingStartPosition;
    this.parent_id=this.config.data.parent_id;
    this.position=this.config.data.position;
    this.activeAdminHierarchy= this.config.data.activeAdminHierarchy
    // this.adminHierarchyService.query({parent_id:this.parent_id,
    //   admin_hierarchy_position:this.ceilingStartLevel})
    //   .subscribe((resp) => {
    //     this.adminHierarchiesList = resp.data??[];
    //     if(this.adminHierarchiesList.length <=0){
    //       this.adminHierarchiesList.push(this.activeAdminHierarchy)
    //     }
    //   });
    fromEvent(this.ceilingSearchInput!.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value;
      })
      ,filter(res => res.length >3 )
      ,debounceTime(1000)
      ,distinctUntilChanged()
    ).subscribe((searchKey: string) => {
      this.isSearching = true;
      searchKey=searchKey.toLowerCase( );
      this.loadCeilings(searchKey).subscribe((res)=> {
        this.ceilings=(res.data ?? []).filter(newCeiling => this.existingCeiling.every((ex: { ceiling_id: any; }) => ex.ceiling_id !== newCeiling.id))
        this.isSearching = false;
      }, (err) => {
          this.isSearching = false;
        });
    });
  }

  ngOnInit(): void {
    this.loadCeilings().subscribe((res)=> {
      var ceilings = (res.data ?? []);
      this.ceilings=ceilings.filter(newCeiling => this.existingCeiling.every((ex: { ceiling_id: any; }) => ex.ceiling_id !== newCeiling.id))
    });
  }

  initiate(raw: FundSourceBudgetClass): void {
    this.selectedSource.push(raw);
    this.ceilings = this.ceilings!.filter((obj) => obj !== raw);
  }


  loadCeilings(searchKey:any=null){
    return this.fundSourceBudgetClassService
      .queryProjectionCeiling({can_project :true,page:1,searchKey:searchKey});
  }

  save(): void{
    this.dialogRef.close({ceiling:this.selectedSource});
  }
  search(searchKey:any){
    this.loadCeilings(searchKey);
  }

  clear(table: Table) {
    this.filterValue = '';
    this.loadCeilings().subscribe((res)=> {
      var ceilings = (res.data ?? []);
      this.ceilings=ceilings.filter(newCeiling => this.existingCeiling.every((ex: { ceiling_id: any; }) => ex.ceiling_id !== newCeiling.id));
      this.ceilings=this.ceilings.filter(newCeiling => this.selectedSource.every((ex: { id: any; }) => ex.id !== newCeiling.id));
    });
  }

  close(): void {
    this.dialogRef.close(true);
  }
}
