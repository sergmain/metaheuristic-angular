import { Component, OnInit } from '@angular/core';
import { environment } from '@src/environments/environment';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CtContentComponent } from '../../modules/ct/ct-content/ct-content.component';
import { CtColsComponent } from '../../modules/ct/ct-cols/ct-cols.component';
import { CtColComponent } from '../../modules/ct/ct-col/ct-col.component';
import { CtSectionComponent } from '../../modules/ct/ct-section/ct-section.component';
import { CtSectionHeaderComponent } from '../../modules/ct/ct-section-header/ct-section-header.component';
import { CtSectionHeaderRowComponent } from '../../modules/ct/ct-section-header-row/ct-section-header-row.component';
import { CtHeadingComponent } from '../../modules/ct/ct-heading/ct-heading.component';
import { CtSectionBodyComponent } from '../../modules/ct/ct-section-body/ct-section-body.component';
import { CtSectionBodyRowComponent } from '../../modules/ct/ct-section-body-row/ct-section-body-row.component';
import { CopyRightComponent } from '../../modules/copy-right/copy-right/copy-right.component';

@Component({
    selector: 'lorem-index',
    templateUrl: './lorem-index.component.html',
    styleUrls: ['./lorem-index.component.sass'],
    imports: [CtContentComponent, CtColsComponent, CtColComponent, CtSectionComponent, CtSectionHeaderComponent, CtSectionHeaderRowComponent, CtHeadingComponent, CtSectionBodyComponent, CtSectionBodyRowComponent, CopyRightComponent]
})
export class LoremIndexComponent {
    content: SafeHtml;
    constructor(private domSanitizer: DomSanitizer) {
        this.content = domSanitizer.bypassSecurityTrustHtml(environment.brandingMsg);
    }
}