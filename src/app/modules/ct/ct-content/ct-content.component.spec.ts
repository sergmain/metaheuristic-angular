import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CtContentComponent } from './ct-content.component';

describe('CtContentComponent', () => {
  let component: CtContentComponent;
  let fixture: ComponentFixture<CtContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CtContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CtContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
