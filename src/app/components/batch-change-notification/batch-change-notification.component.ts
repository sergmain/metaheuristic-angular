import { Component, OnDestroy, OnInit } from '@angular/core';
import { AudioNotification } from '@src/app/services/audioNotification/audioNotification.service';
import { BatchExexStatusService } from '@src/app/services/batch/BatchExecStatusService';
import { Subscription } from 'rxjs';

@Component({
    selector: 'batch-change-notification',
    templateUrl: './batch-change-notification.component.html',
    styleUrls: ['./batch-change-notification.component.sass']
})
export class BatchChangeNotificationComponent implements OnInit, OnDestroy {
    isActive: boolean = false;
    subs: Subscription[] = []

    constructor(
        private batchExexStatusService: BatchExexStatusService,
        private audioNotification: AudioNotification,
    ) { }

    ngOnInit(): void {
        this.batchExexStatusService.getChanges.subscribe(result => {
            if (result?.isFinished) {
                this.audioNotification.play();
                this.isActive = true;
            }
        })
    }

    ngOnDestroy() {
        this.subs.forEach(s => s.unsubscribe())
    }
    
    hide() {
        this.isActive = false;
    }
}
