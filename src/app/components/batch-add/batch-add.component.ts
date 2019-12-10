import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LoadStates } from '@app/enums/LoadStates';
import { Plan } from '@app/models/Plan';
import { BatchService } from '@app/services/batch/batch.service';
import { response } from '@app/services/batch/response';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { IAppState } from '@src/app/app.reducers';
import { CtFileUploadComponent } from '@src/app/ct';
import { Subscription } from 'rxjs';

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

    plan: Plan;
    file: any;
    listOfPlans: Plan[] = [];
    @ViewChild('fileUpload', { static: false }) fileUpload: CtFileUploadComponent;

    constructor(
        private batchService: BatchService,
        private router: Router,
        private translate: TranslateService,
        private store: Store < IAppState >
    ) {
        this.currentStates.add(this.states.firstLoading);
        // this.settingsService.settingsObserver
        //     .subscribe((settings: Settings) =>
        //         this.translate.use(settings.language));

        store.subscribe((data: IAppState) => {
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
                    this.listOfPlans = this.response.items;
                },
                () => {},
                () => {
                    this.currentStates.delete(this.states.firstLoading);
                    this.currentStates.delete(this.states.loading);
                    this.currentStates.add(this.states.show);
                    subscribe.unsubscribe();
                }
            );
    }

    back() {
        this.router.navigate(['/launchpad', 'batch']);
    }

    upload() {
        this.batchService.batch
            .upload(this.plan.id, this.fileUpload.fileInput.nativeElement.files[0])
            .subscribe((response: response.batch.Upload) => {
                if (response.status.toLowerCase() === 'ok') {
                    this.router.navigate(['/launchpad', 'batch']);
                }
                this.uploadResponse = response;
            });
    }

    fileUploadChanged() {
        this.file = this.fileUpload.fileInput.nativeElement.files[0] || false;
    }
}