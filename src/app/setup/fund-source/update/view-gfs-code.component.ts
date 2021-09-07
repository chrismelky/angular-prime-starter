import {Component, Input, OnInit} from '@angular/core';
import {GfsCodeService} from "../../gfs-code/gfs-code.service";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {HelperService} from "../../../utils/helper.service";
import {Router} from "@angular/router";
import {ConfirmationService} from "primeng/api";

@Component({
  selector: 'app-view-gfs-code',
  templateUrl: './view-gfs-code.component.html',
  styleUrls: ['./view-gfs-code.component.scss']
})
export class ViewGfsCodeComponent implements OnInit {
  @Input() aggregated_code?:string;
  gfsCodes: any[] | undefined=[];
  constructor(
    private gfsCodeService: GfsCodeService,
  ) { }

  ngOnInit(): void {

  }

  loadGfsCode(): void {
    this.gfsCodeService.getGfsCode(this.aggregated_code!).subscribe((resp) => {
      this.gfsCodes= resp.data;
      console.log(this.gfsCodes)
    });
  }

  onHide(): void {
  }
}
