import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialAppModule } from '@src/app/ngmaterial.module';
import { CtSectionContentComponent } from './ct-section-content/ct-section-content.component';
import { CtPreComponent } from './ct-pre/ct-pre.component';
import { CtHeadingComponent } from './ct-heading/ct-heading.component';
import { CtSectionBodyRowComponent } from './ct-section-body-row/ct-section-body-row.component';
import { CtSectionFooterRowComponent } from './ct-section-footer-row/ct-section-footer-row.component';
import { CtSectionFooterComponent } from './ct-section-footer/ct-section-footer.component';
import { CtColComponent } from './ct-col/ct-col.component';
import { CtColsComponent } from './ct-cols/ct-cols.component';
import { CtSectionCaptionComponent } from './ct-section-caption/ct-section-caption.component';
import { CtTableComponent } from './ct-table/ct-table.component';
import { CtWrapBlockComponent } from './ct-wrap-block/ct-wrap-block.component';
import { CtFileUploadComponent } from './ct-file-upload/ct-file-upload.component';
import { CtSectionHeaderComponent } from './ct-section-header/ct-section-header.component';
import { CtSectionComponent } from './ct-section/ct-section.component';
import { CtSectionHeaderRowComponent } from './ct-section-header-row/ct-section-header-row.component';
import { CtFlexComponent } from './ct-flex/ct-flex.component';
import { CtFlexItemComponent } from './ct-flex-item/ct-flex-item.component';
import { CtSectionBodyComponent } from './ct-section-body/ct-section-body.component';
import { CtHintComponent } from './ct-hint/ct-hint.component';
import { CtContentComponent } from './ct-content/ct-content.component';

@NgModule({
    imports: [
        CommonModule,
        MaterialAppModule
    ],
    declarations: [
        CtSectionContentComponent,
        CtPreComponent,
        CtHeadingComponent,
        CtSectionBodyRowComponent,
        CtSectionFooterRowComponent,
        CtSectionFooterComponent,
        CtColComponent,
        CtColsComponent,
        CtSectionCaptionComponent,
        CtTableComponent,
        CtWrapBlockComponent,
        CtFileUploadComponent,
        CtSectionHeaderComponent,
        CtSectionComponent,
        CtSectionHeaderRowComponent,
        CtFlexComponent,
        CtFlexItemComponent,
        CtSectionBodyComponent,
        CtHintComponent,
        CtContentComponent
    ],
    exports: [
        CtSectionContentComponent,
        CtPreComponent,
        CtHeadingComponent,
        CtSectionBodyRowComponent,
        CtSectionFooterRowComponent,
        CtSectionFooterComponent,
        CtColComponent,
        CtColsComponent,
        CtSectionCaptionComponent,
        CtTableComponent,
        CtWrapBlockComponent,
        CtFileUploadComponent,
        CtSectionHeaderComponent,
        CtSectionComponent,
        CtSectionHeaderRowComponent,
        CtFlexComponent,
        CtFlexItemComponent,
        CtSectionBodyComponent,
        CtHintComponent,
        CtContentComponent
    ]
})

export class CtModule { }