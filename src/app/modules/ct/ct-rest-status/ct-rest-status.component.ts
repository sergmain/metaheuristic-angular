import { Component, Input } from '@angular/core';
import { DefaultResponse } from '@app/models/DefaultResponse';

import { CtSectionComponent } from '../ct-section/ct-section.component';
import { CtSectionBodyComponent } from '../ct-section-body/ct-section-body.component';
import { CtSectionBodyRowComponent } from '../ct-section-body-row/ct-section-body-row.component';
import { CtHeadingComponent } from '../ct-heading/ct-heading.component';

@Component({
    standalone : true,
    selector: 'ct-rest-status',
    templateUrl: './ct-rest-status.component.html',
    styleUrls: ['./ct-rest-status.component.scss'],
    imports: [CtSectionComponent, CtSectionBodyComponent, CtSectionBodyRowComponent, CtHeadingComponent]
})
export class CtRestStatusComponent {
  @Input() content: DefaultResponse;
}
