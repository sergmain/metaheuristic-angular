import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaunchpadRootComponent } from './launchpad-root.component';

describe('LaunchpadRootComponent', () => {
  let component: LaunchpadRootComponent;
  let fixture: ComponentFixture<LaunchpadRootComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaunchpadRootComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaunchpadRootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
