import { Component, OnInit } from '@angular/core';
import { CtSectionComponent } from '../../ct/ct-section/ct-section.component';
import { CtSectionBodyComponent } from '../../ct/ct-section-body/ct-section-body.component';
import { CtSectionBodyRowComponent } from '../../ct/ct-section-body-row/ct-section-body-row.component';
import { CtEnvMsgOuterComponent } from '../../ct/ct-env-msg-outer/ct-env-msg-outer.component';

@Component({
    standalone : true,
    selector: 'dispatcher-index',
    templateUrl: './dispatcher-index.component.html',
    styleUrls: ['./dispatcher-index.component.sass'],
    imports: [CtSectionComponent, CtSectionBodyComponent, CtSectionBodyRowComponent, CtEnvMsgOuterComponent]
})
export class DispatcherIndexComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
