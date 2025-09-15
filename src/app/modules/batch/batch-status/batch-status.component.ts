import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadStates } from '@app/enums/LoadStates';
import { BatchService } from '@app/services/batch/batch.service';
import { Status } from '@app/services/batch/Status';

@Component({
    selector: 'batch-status',
    templateUrl: './batch-status.component.html',
    styleUrls: ['./batch-status.component.scss'],
    standalone: false
})

export class BatchStatusComponent implements OnInit {
    readonly states = LoadStates;
    currentState: LoadStates = LoadStates.firstLoading;

    response: Status;
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
        this.batchService
            .getProcessingResourceStatus(this.batchId)
            .subscribe(response => {
                this.response = response;
                this.currentState = this.states.show;
            });
    }
}