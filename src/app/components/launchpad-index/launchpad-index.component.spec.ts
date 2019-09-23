import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaunchpadIndexComponent } from './launchpad-index.component';

describe('LaunchpadIndexComponent', () => {
  let component: LaunchpadIndexComponent;
  let fixture: ComponentFixture<LaunchpadIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaunchpadIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaunchpadIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
