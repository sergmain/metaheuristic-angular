import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadStates } from '@app/enums/LoadStates';
import { BatchService } from '@app/services/batch/batch.service';
import { SourceCode } from '@app/services/source-codes/SourceCode';
import { SourceCodeUid } from '@app/services/source-codes/SourceCodeUid';
import { TranslateService } from '@ngx-translate/core';
import { OperationStatus } from '@app/enums/OperationStatus';
import { OperationStatusRest } from '@app/models/OperationStatusRest';
import { UIStateComponent } from '@app/models/UIStateComponent';
import { AuthenticationService } from '@app/services/authentication';
import { SettingsService, SettingsServiceEventChange } from '@app/services/settings/settings.service';
import { SourceCodeUidsForCompany } from '@app/services/source-codes/SourceCodeUidsForCompany';
import { CtFileUploadComponent } from '../../ct/ct-file-upload/ct-file-upload.component';

@Component({
    selector: 'batch-add',
    templateUrl: './batch-add.component.html',
    styleUrls: ['./batch-add.component.scss'],
    standalone: false
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