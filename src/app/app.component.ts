import {AfterViewInit, Component, OnInit, Renderer2} from '@angular/core';
import {PrimeNGConfig} from 'primeng/api';
import {LoaderService} from "./shared/loader-service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  constructor(private primengConfig: PrimeNGConfig,
              private loaderService: LoaderService,
              private renderer: Renderer2) {
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
  }

  ngAfterViewInit() {
    this.loaderService.httpProgress().subscribe((status: boolean) => {
      if (status) {
        this.renderer.addClass(document.body, 'cursor-loader');
      } else {
        this.renderer.removeClass(document.body, 'cursor-loader');
      }
    });
  }
}
