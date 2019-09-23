import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoremIndexComponent } from './lorem-index.component';

describe('LoremIndexComponent', () => {
  let component: LoremIndexComponent;
  let fixture: ComponentFixture<LoremIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoremIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoremIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
