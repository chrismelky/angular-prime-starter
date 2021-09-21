import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectiveTreeComponent } from './objective-tree.component';

describe('ObjectiveTreeComponent', () => {
  let component: ObjectiveTreeComponent;
  let fixture: ComponentFixture<ObjectiveTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ObjectiveTreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectiveTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
