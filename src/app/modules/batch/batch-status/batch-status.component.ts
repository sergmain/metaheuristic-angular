import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadStates } from '@app/enums/LoadStates';
import { BatchService } from '@app/services/batch/batch.service';
import { Status } from '@app/services/batch/Status';
import { CtSectionComponent } from '../../ct/ct-section/ct-section.component';
import { CtSectionHeaderComponent } from '../../ct/ct-section-header/ct-section-header.component';
import { CtSectionHeaderRowComponent } from '../../ct/ct-section-header-row/ct-section-header-row.component';
import { CtHeadingComponent } from '../../ct/ct-heading/ct-heading.component';
import { CtSectionBodyComponent } from '../../ct/ct-section-body/ct-section-body.component';
import { NgIf } from '@angular/common';
import { CtSectionBodyRowComponent } from '../../ct/ct-section-body-row/ct-section-body-row.component';
import { CtPreComponent } from '../../ct/ct-pre/ct-pre.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'batch-status',
    templateUrl: './batch-status.component.html',
    styleUrls: ['./batch-status.component.scss'],
    imports: [CtSectionComponent, CtSectionHeaderComponent, CtSectionHeaderRowComponent, CtHeadingComponent, CtSectionBodyComponent, NgIf, CtSectionBodyRowComponent, CtPreComponent, TranslateModule]
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