import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionTreeComponent } from './section-tree.component';

describe('SectionTreeComponent', () => {
  let component: SectionTreeComponent;
  let fixture: ComponentFixture<SectionTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SectionTreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
