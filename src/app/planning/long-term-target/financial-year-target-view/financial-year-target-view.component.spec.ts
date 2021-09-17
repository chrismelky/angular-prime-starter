import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialYearTargetViewComponent } from './financial-year-target-view.component';

describe('FinancialYearTargetViewComponent', () => {
  let component: FinancialYearTargetViewComponent;
  let fixture: ComponentFixture<FinancialYearTargetViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinancialYearTargetViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancialYearTargetViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
