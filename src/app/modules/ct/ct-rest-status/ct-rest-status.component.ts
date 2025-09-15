import { Component, Input } from '@angular/core';
import { DefaultResponse } from '@app/models/DefaultResponse';
import { NgIf, NgFor } from '@angular/common';
import { CtSectionComponent } from '../ct-section/ct-section.component';
import { CtSectionBodyComponent } from '../ct-section-body/ct-section-body.component';
import { CtSectionBodyRowComponent } from '../ct-section-body-row/ct-section-body-row.component';
import { CtHeadingComponent } from '../ct-heading/ct-heading.component';

@Component({
    selector: 'ct-rest-status',
    templateUrl: './ct-rest-status.component.html',
    styleUrls: ['./ct-rest-status.component.scss'],
    imports: [NgIf, CtSectionComponent, CtSectionBodyComponent, CtSectionBodyRowComponent, CtHeadingComponent, NgFor]
})
export class CtRestStatusComponent {
  @Input() content: DefaultResponse;
}
