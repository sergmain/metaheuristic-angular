import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LoadStates } from '@app/enums/LoadStates';
import { BatchService } from '@app/services/batch/batch.service';
import { response } from '@app/services/batch/response';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { AppState } from '@src/app/app.reducers';
import { Subscription } from 'rxjs';
import { CtFileUploadComponent } from '../../ct/ct-file-upload/ct-file-upload.component';
import { SourceCode } from '@app/services/source-codes/SourceCode';
import {SourceCodeUid} from '@app/services/source-codes/SourceCodeUid';

@Component({
    selector: 'batch-add',
    templateUrl: './batch-add.component.html',
    styleUrls: ['./batch-add.component.scss']
})

export class BatchAddComponent implements OnInit {
    readonly states = LoadStates;

    currentStates = new Set();
    response: response.batch.Add;
    uploadResponse: response.batch.Upload;

    sourceCode: SourceCode;
    file: any;
    listOfSourceCodes: SourceCodeUid[] = [];
    @ViewChild('fileUpload') fileUpload: CtFileUploadComponent;

    constructor(
        private batchService: BatchService,
        private router: Router,
        private translate: TranslateService,
        private store: Store<AppState>
    ) {
        this.currentStates.add(this.states.firstLoading);
        // this.settingsService.settingsObserver
        //     .subscribe((settings: Settings) =>
        //         this.translate.use(settings.language));

        store.subscribe((data: AppState) => {
            this.translate.use(data.settings.language);
        });
    }

    ngOnInit() { this.updateResponse(); }

    updateResponse() {
        const subscribe: Subscription = this.batchService.batch
            .add()
            .subscribe(
                (response: response.batch.Add) => {
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

    back() {
        this.router.navigate(['/dispatcher', 'batch']);
    }

    upload() {
        this.batchService.batch
            .upload(this.sourceCode.id, this.fileUpload.fileInput.nativeElement.files[0])
            .subscribe((response: response.batch.Upload) => {
                if (response.status.toLowerCase() === 'ok') {
                    this.router.navigate(['/dispatcher', 'batch']);
                }
                this.uploadResponse = response;
            });
    }

    fileUploadChanged() {
        this.file = this.fileUpload.fileInput.nativeElement.files[0] || false;
    }
}