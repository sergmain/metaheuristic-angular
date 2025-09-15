import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadStates } from '@app/enums/LoadStates';
import { BatchService } from '@app/services/batch/batch.service';
import { SourceCode } from '@app/services/source-codes/SourceCode';
import { SourceCodeUid } from '@app/services/source-codes/SourceCodeUid';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { OperationStatus } from '@app/enums/OperationStatus';
import { OperationStatusRest } from '@app/models/OperationStatusRest';
import { UIStateComponent } from '@app/models/UIStateComponent';
import { AuthenticationService } from '@app/services/authentication';
import { SettingsService, SettingsServiceEventChange } from '@app/services/settings/settings.service';
import { SourceCodeUidsForCompany } from '@app/services/source-codes/SourceCodeUidsForCompany';
import { CtFileUploadComponent } from '../../ct/ct-file-upload/ct-file-upload.component';
import { NgIf, NgFor } from '@angular/common';
import { CtColsComponent } from '../../ct/ct-cols/ct-cols.component';
import { CtColComponent } from '../../ct/ct-col/ct-col.component';
import { CtSectionComponent } from '../../ct/ct-section/ct-section.component';
import { CtSectionHeaderComponent } from '../../ct/ct-section-header/ct-section-header.component';
import { CtSectionHeaderRowComponent } from '../../ct/ct-section-header-row/ct-section-header-row.component';
import { CtHeadingComponent } from '../../ct/ct-heading/ct-heading.component';
import { CtSectionBodyComponent } from '../../ct/ct-section-body/ct-section-body.component';
import { CtSectionBodyRowComponent } from '../../ct/ct-section-body-row/ct-section-body-row.component';
import { MatFormField, MatLabel, MatHint } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatOption } from '@angular/material/autocomplete';
import { CtHintComponent } from '../../ct/ct-hint/ct-hint.component';
import { CtSectionFooterComponent } from '../../ct/ct-section-footer/ct-section-footer.component';
import { CtSectionFooterRowComponent } from '../../ct/ct-section-footer-row/ct-section-footer-row.component';
import { MatButton } from '@angular/material/button';
import { CtRestStatusComponent } from '../../ct/ct-rest-status/ct-rest-status.component';

@Component({
    selector: 'batch-add',
    templateUrl: './batch-add.component.html',
    styleUrls: ['./batch-add.component.scss'],
    imports: [NgIf, CtColsComponent, CtColComponent, CtSectionComponent, CtSectionHeaderComponent, CtSectionHeaderRowComponent, CtHeadingComponent, CtSectionBodyComponent, CtSectionBodyRowComponent, MatFormField, MatLabel, MatSelect, FormsModule, NgFor, MatOption, MatHint, CtFileUploadComponent, CtHintComponent, CtSectionFooterComponent, CtSectionFooterRowComponent, MatButton, CtRestStatusComponent, TranslateModule]
})

export class BatchAddComponent extends UIStateComponent implements OnInit, OnDestroy {
    currentStates: Set<LoadStates> = new Set();
    response: SourceCodeUidsForCompany;
    uploadResponse: OperationStatusRest;

    sourceCode: SourceCode;
    file: File;
    listOfSourceCodes: SourceCodeUid[] = [];
    @ViewChild('fileUpload') fileUpload: CtFileUploadComponent;

    constructor(
        private batchService: BatchService,
        private router: Router,
        private route: ActivatedRoute,
        private translate: TranslateService,
        private settingsService: SettingsService,
        readonly authenticationService: AuthenticationService,
    ) {
        super(authenticationService);
    }

    ngOnInit(): void {
        this.subscribeSubscription(this.settingsService.events.subscribe(event => {
            if (event instanceof SettingsServiceEventChange) {
                this.translate.use(event.settings.language);
            }
        }));

        this.updateResponse();
    }

    ngOnDestroy(): void {
        this.unsubscribeSubscriptions();
    }

    updateResponse(): void {
        this.batchService
            .batchAdd()
            .subscribe((response) => {
                this.response = response;
                this.listOfSourceCodes = this.response.items;
            });
    }

    back(): void {
        this.router.navigate(['../'], { relativeTo: this.route });
    }

    upload(): void {
        this.batchService
            .uploadFile(this.sourceCode.id.toString(), this.fileUpload.fileInput.nativeElement.files[0])
            .subscribe((response) => {
                if (response.status === OperationStatus.OK) {
                    this.back();
                }
                this.uploadResponse = response;
            });
    }

    fileUploadChanged(): void {
        this.file = this.fileUpload.fileInput.nativeElement.files[0] || false;
    }
}