import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaunchpadNavigationComponent } from './launchpad-navigation.component';

describe('LaunchpadNavigationComponent', () => {
  let component: LaunchpadNavigationComponent;
  let fixture: ComponentFixture<LaunchpadNavigationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaunchpadNavigationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaunchpadNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
