import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadStates } from '@app/enums/LoadStates';
import { BatchService } from '@app/services/batch/batch.service';
import { response as batchResponse } from '@app/services/batch/response';
import { SourceCode } from '@app/services/source-codes/SourceCode';
import { SourceCodeUid } from '@app/services/source-codes/SourceCodeUid';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { AppState } from '@src/app/app.reducers';
import { OperationStatus } from '@src/app/models/OperationStatus';
import { Subscription } from 'rxjs';
import { CtFileUploadComponent } from '../../ct/ct-file-upload/ct-file-upload.component';

@Component({
    selector: 'batch-add',
    templateUrl: './batch-add.component.html',
    styleUrls: ['./batch-add.component.scss']
})

export class BatchAddComponent implements OnInit {
    readonly states = LoadStates;

    currentStates: Set<LoadStates> = new Set();
    response: batchResponse.batch.Add;
    uploadResponse: batchResponse.batch.Upload;

    sourceCode: SourceCode;
    file: File;
    listOfSourceCodes: SourceCodeUid[] = [];
    @ViewChild('fileUpload') fileUpload: CtFileUploadComponent;

    constructor(
        private batchService: BatchService,
        private router: Router,
        private route: ActivatedRoute,
        private translate: TranslateService,
        private store: Store<AppState>
    ) {
        this.currentStates.add(this.states.firstLoading);
        store.subscribe((data: AppState) => {
            this.translate.use(data.settings.language);
        });
    }

    ngOnInit(): void {
        this.updateResponse();
    }

    updateResponse(): void {
        const subscribe: Subscription = this.batchService.batch
            .add()
            .subscribe(
                (response: batchResponse.batch.Add) => {
                    this.response = response;
                    this.listOfSourceCodes = this.response.items;
                },
                () => { },
                () => {
                    this.currentStates.delete(this.states.firstLoading);
                    this.currentStates.delete(this.states.loading);
                    this.currentStates.add(this.states.show);
                    subscribe.unsubscribe();
                }
            );
    }

    back(): void {
        this.router.navigate(['../'], { relativeTo: this.route });
    }

    upload(): void {
        this.batchService.batch
            .upload(this.sourceCode.id.toString(), this.fileUpload.fileInput.nativeElement.files[0])
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