import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadStates } from '@app/enums/LoadStates';
import { BatchService } from '@app/services/batch/batch.service';
import { Subscription } from 'rxjs';
import { response } from '@app/services/batch/response';

@Component({
    selector: 'batch-status',
    templateUrl: './batch-status.component.html',
    styleUrls: ['./batch-status.component.scss']
})

export class BatchStatusComponent implements OnInit {
    readonly states = LoadStates;
    currentState: LoadStates = LoadStates.firstLoading;

    response: response.batch.Status;
    batchId: string;

    constructor(
        private route: ActivatedRoute,
        private batchService: BatchService,
        private router: Router
    ) { }

    ngOnInit() {
        this.batchId = this.route.snapshot.paramMap.get('batchId');
        this.updateResponse();
    }
    updateResponse() {
        const subscribe: Subscription = this.batchService.batch
            .status(this.batchId)
            .subscribe(
                (response: response.batch.Status) => {
                    this.response = response;
                    this.currentState = this.states.show;
                },
                () => { },
                () => {
                    subscribe.unsubscribe();
                },
            );

    }
}