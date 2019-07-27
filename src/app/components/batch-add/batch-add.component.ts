import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LoadStates } from '@app/enums/LoadStates';
import { Plan } from '@app/models/Plan';
import { batch, BatchService } from '@app/services/batch/batch.service';
import { CtFileUploadComponent } from '@src/app/ct';
import { Subscription } from 'rxjs';




@Component({
    selector: 'batch-add',
    templateUrl: './batch-add.component.pug',
    styleUrls: ['./batch-add.component.scss']
})


export class BatchAddComponent implements OnInit {
    readonly states = LoadStates;


    currentStates = new Set();
    response: batch.add.Response;
    uploadResponse: batch.upload.Response;

    plan: Plan;
    listOfPlans: Plan[] = [];
    @ViewChild('fileUpload') fileUpload: CtFileUploadComponent;

    constructor(
        private batchService: BatchService,
        private router: Router
    ) {
        this.currentStates.add(this.states.firstLoading);
    }

    ngOnInit() { this.updateResponse(); }

    updateResponse() {
        const subscribe: Subscription = this.batchService.batch
            .add()
            .subscribe(
                (response: batch.add.Response) => {
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
        const formData: FormData = new FormData();
        formData.append('file', this.fileUpload.fileInput.nativeElement.files[0]);
        formData.append('planId', this.plan.id);
        // TODO what if no planId
        console.log(this);
        const subscribe: Subscription = this.batchService.batch
            .upload(formData)
            .subscribe(
                (response: batch.upload.Response) => {
                    // TODO replace|update conditional
                    if (response.status.toLowerCase() === 'ok') {
                        this.router.navigate(['/launchpad', 'batch']);
                    } else {
                        this.uploadResponse = response;
                    }
                },
                () => {},
                () => subscribe.unsubscribe()
            );
    }
}