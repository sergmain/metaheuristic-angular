import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { AudioNotification } from '@app/services/audioNotification/audioNotification.service';
import { BatchExecStatusService } from '@app/services/batch/BatchExecStatusService';
import { Subscription } from 'rxjs';

import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'batch-change-notification',
    templateUrl: './batch-change-notification.component.html',
    styleUrls: ['./batch-change-notification.component.sass'],
    imports: [MatIcon],
    standalone: true
})
export class BatchChangeNotificationComponent implements OnInit, OnDestroy {
      private batchExecStatusService = inject(BatchExecStatusService);
      private audioNotification = inject(AudioNotification);
    isActive: boolean = false;
    subs: Subscription[] = [];

    ngOnInit(): void {
        this.batchExecStatusService.getChanges.subscribe(result => {
            if (result?.isFinished) {
                this.audioNotification.play();
                this.isActive = true;
            }
        });
    }

    ngOnDestroy(): void {
        this.subs.forEach(s => s.unsubscribe());
    }

    hide(): void {
        this.isActive = false;
    }
}
