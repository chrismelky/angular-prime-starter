import {Component, Input, OnInit} from '@angular/core';
import {GfsCodeService} from "../../gfs-code/gfs-code.service";
import {CustomResponse} from "../../../utils/custom-response";
import {GfsCode} from "../../gfs-code/gfs-code.model";

@Component({
  selector: 'app-view-gfs-code',
  templateUrl: './view-gfs-code.component.html',
  styleUrls: ['./view-gfs-code.component.scss']
})
export class ViewGfsCodeComponent implements OnInit {
  @Input() fund_source?:any;
  gfsCodes: any[] | undefined=[];
  aggregatedCode : string='';
  constructor(
    private gfsCodeService: GfsCodeService,
  ) { }

  ngOnInit(): void {
  }

  loadGfsCode(): void {
    this.aggregatedCode = this.fund_source.gfs_code.code;
    this.gfsCodeService
      .query({aggregated_code:this.aggregatedCode,page:1})
      .subscribe(
        (res: CustomResponse<GfsCode[]>) => {
          this.gfsCodes = res?.data ?? [];
        });
  }

  onHide(): void {
  }
}
