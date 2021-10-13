import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loader',
  template: `
    <span
      fxLayoutAlign="center center"
      *ngIf="isLoading"
      style="
    cursor: loading;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index:3310;

  "
    >
      <p-progressSpinner animationDuration="0.5s"></p-progressSpinner>
    </span>
  `,
  styles: [],
})
export class LoaderComponent implements OnInit {
  constructor() {}
  @Input() isLoading = false;
  ngOnInit(): void {}
}
