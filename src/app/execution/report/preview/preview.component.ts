/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ReportService } from '../report.service';

@Component({
  selector: 'app-report-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
})
export class PreviewComponent implements OnInit, AfterViewInit {
  @ViewChild('reportBody') reportBody!: ElementRef;

  constructor(protected reportService: ReportService) {}

  ngOnInit(): void {
    //Console
  }

  ngAfterViewInit(): void {
    this.loadReport(1);
    document
      .querySelector('.report-sidebar .p-sidebar-header')
      ?.insertAdjacentHTML(
        'afterbegin',
        "<span class='title'>Planrep Mtef Report</span> ( Arusha CC [2022/23] )"
      );
  }

  loadReport(page?: number): void {
    this.reportService
      .getJasperReport('Mtef/FORM_3A', {
        j_username: 'jasperadmin',
        j_password: 'jasperadmin',
        admin_hierarchy_id: 420,
        financial_year_id: 3,
        budget_type: 'CURRENT',
        // page: page,
      })
      .subscribe(
        (resp) => {
          console.log(resp);
          this.reportBody.nativeElement.insertAdjacentHTML('afterend', resp);
        },
        (error) => {
          console.log(error);
        }
      );
  }
}
