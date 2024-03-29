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
import { CtRestStatusComponent } from './ct-rest-status/ct-rest-status.component';
import { CtBackButtonComponent } from './ct-back-button/ct-back-button.component';
import { TranslateModule } from '@ngx-translate/core';
import { CtEnvMsgOuterComponent } from './ct-env-msg-outer/ct-env-msg-outer.component';
import { CtTablePaginationComponent } from './ct-table-pagination/ct-table-pagination.component';
import { CtStateOfTasksComponent } from './ct-state-of-tasks/ct-state-of-tasks.component';
import { CtAlertComponent } from './ct-alert/ct-alert.component';
import { CtPre10pxComponent } from './ct-pre-10px/ct-pre-10px.component';
import {CtExecContextsComponent} from '@app/modules/ct/ct-exec-contexts/ct-exec-contexts.component';
import {RouterModule} from '@angular/router';

@NgModule({
    imports: [
        CommonModule,
        MaterialAppModule,
        TranslateModule.forChild({}),
        RouterModule
    ],
    declarations: [
        CtSectionContentComponent,
        CtPreComponent,
        CtPre10pxComponent,
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
        CtContentComponent,
        CtRestStatusComponent,
        CtBackButtonComponent,
        CtEnvMsgOuterComponent,
        CtTablePaginationComponent,
        CtStateOfTasksComponent,
        CtAlertComponent,
        CtExecContextsComponent
    ],
    exports: [
        CtSectionContentComponent,
        CtPreComponent,
        CtPre10pxComponent,
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
        CtContentComponent,
        CtRestStatusComponent,
        CtBackButtonComponent,
        CtEnvMsgOuterComponent,
        CtTablePaginationComponent,
        CtStateOfTasksComponent,
        CtAlertComponent,
        CtExecContextsComponent,
        RouterModule
    ]
})

export class CtModule { }