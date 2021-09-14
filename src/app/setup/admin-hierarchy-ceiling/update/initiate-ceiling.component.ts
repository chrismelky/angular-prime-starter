import { Component, OnInit } from '@angular/core';
import { FundSourceBudgetClassService } from '../../fund-source-budget-class/fund-source-budget-class.service';
import { CustomResponse } from '../../../utils/custom-response';
import { Section } from '../../section/section.model';
import { FundSourceBudgetClass } from '../../fund-source-budget-class/fund-source-budget-class.model';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FundSourceBudgetClassService} from "../../fund-source-budget-class/fund-source-budget-class.service";
import {FundSourceBudgetClass} from "../../fund-source-budget-class/fund-source-budget-class.model";
import {DynamicDialogRef} from "primeng/dynamicdialog";
import {Table} from "primeng/table";
import {fromEvent} from "rxjs";
import {debounceTime, distinctUntilChanged, filter, map, subscribeOn} from 'rxjs/operators';

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

  constructor(
    private fundSourceBudgetClassService:FundSourceBudgetClassService,
    public dialogRef: DynamicDialogRef,
  ) {  console.log(this.ceilingSearchInput);}

  ngAfterViewInit() {
    fromEvent(this.ceilingSearchInput!.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value;
      })
      ,filter(res => res.length > 0)
      ,debounceTime(1000)
      ,distinctUntilChanged()
    ).subscribe((searchKey: string) => {
      this.isSearching = true;
      this.loadCeilings(searchKey).subscribe((res)=> {
        this.ceilings = res.data ?? [];
        this.isSearching = false;
      }, (err) => {
          this.isSearching = false;
          console.log('error', err);
        });
    });
  }

  ngOnInit(): void {
    this.fundSourceBudgetClassService
      .queryProjectionCeiling({ can_project: true, page: 1 })
      .subscribe(
        (resp: CustomResponse<Section[]>) => (this.ceilings = resp.data ?? [])
      );
    //this.loadCeilings();
  }
  initiate(raw: FundSourceBudgetClass): void {
    this.selectedSource.push(raw);
    this.ceilings = this.ceilings!.filter((obj) => obj !== raw);
  }

  save(): void {}
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
    this.loadCeilings();
  }

  close(): void {
    this.dialogRef.close(true);
  }
}
