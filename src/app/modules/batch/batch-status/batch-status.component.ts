import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadStates } from '@app/enums/LoadStates';
import { BatchService } from '@app/services/batch/batch.service';
import { Status } from '@app/services/batch/Status';
import { CtSectionComponent } from '../../ct/ct-section/ct-section.component';
import { CtSectionHeaderComponent } from '../../ct/ct-section-header/ct-section-header.component';
import { CtSectionHeaderRowComponent } from '../../ct/ct-section-header-row/ct-section-header-row.component';
import { CtHeadingComponent } from '../../ct/ct-heading/ct-heading.component';
import { CtSectionBodyComponent } from '../../ct/ct-section-body/ct-section-body.component';

import { CtSectionBodyRowComponent } from '../../ct/ct-section-body-row/ct-section-body-row.component';
import { CtPreComponent } from '../../ct/ct-pre/ct-pre.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'batch-status',
    templateUrl: './batch-status.component.html',
    styleUrls: ['./batch-status.component.scss'],
    imports: [CtSectionComponent, CtSectionHeaderComponent, CtSectionHeaderRowComponent, CtHeadingComponent, CtSectionBodyComponent, CtSectionBodyRowComponent, CtPreComponent, TranslateModule]
})

export class BatchStatusComponent implements OnInit {
      private route = inject(ActivatedRoute);
      private batchService = inject(BatchService);
      private router = inject(Router);
    readonly states = LoadStates;
    currentState = signal<LoadStates>(LoadStates.firstLoading);

    response = signal<Status | undefined>(undefined);
    batchId = signal<string | undefined>(undefined);

    ngOnInit() {
        this.batchId.set(this.route.snapshot.paramMap.get('batchId'));
        this.updateResponse();
    }
    updateResponse() {
        this.batchService
            .getProcessingResourceStatus(this.batchId())
            .subscribe(response => {
                this.response.set(response);
                this.currentState.set(this.states.show);
            });
    }
}