import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadStates } from '@app/enums/LoadStates';
import { BatchService } from '@app/services/batch/batch.service';
import { SourceCode } from '@app/services/source-codes/SourceCode';
import { SourceCodeUid } from '@app/services/source-codes/SourceCodeUid';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { AppState } from '@src/app/app.reducers';
import { OperationStatus } from '@src/app/enums/OperationStatus';
import { Subscription } from 'rxjs';
import { CtFileUploadComponent } from '../../ct/ct-file-upload/ct-file-upload.component';
import { SourceCodeUidsForCompany } from '@src/app/services/source-codes/SourceCodeUidsForCompany';
import { OperationStatusRest } from '@src/app/models/OperationStatusRest';
import { SettingsService } from '@src/app/services/settings/settings.service';
import { UIStateComponent } from '@src/app/models/UIStateComponent';
import { AuthenticationService } from '@src/app/services/authentication';

@Component({
    selector: 'batch-add',
    templateUrl: './batch-add.component.html',
    styleUrls: ['./batch-add.component.scss']
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
        this.subs.push(this.settingsService.data.subscribe(settings => {
            this.translate.use(settings.language);
        }));
        this.updateResponse();
    }

    ngOnDestroy(): void {
        this.subs.forEach(s => s.unsubscribe());
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