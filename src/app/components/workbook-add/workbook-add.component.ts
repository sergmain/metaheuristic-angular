import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadStates } from '@app/enums/LoadStates';
import { state } from '@app/helpers/state';
import { WorkbookAddCommitResponse } from '@app/models';
import { PlansService } from '@app/services/plans/plans.service';
@Component({
    selector: 'workbook-add',
    templateUrl: './workbook-add.component.pug',
    styleUrls: ['./workbook-add.component.scss']
})

export class WorkbookAddComponent {
    readonly states = LoadStates;
    currentStates = new Set();

    state = state;
    currentState = state.show;

    code: string;
    resources: string;

    responseSingle: WorkbookAddCommitResponse.Response;
    responseMulti: WorkbookAddCommitResponse.Response;
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private plansService: PlansService
    ) {}

    cancel() {
        this.router.navigate(['/launchpad', 'plans', this.route.snapshot.paramMap.get('planId'), 'workbooks']);
    }

    createWithCode() {
        this.currentStates.add(this.states.loading);
        this.plansService.workbook
            .addCommit(this.route.snapshot.paramMap.get('planId'), this.code, '')
            .subscribe(
                (response: WorkbookAddCommitResponse.Response) => {
                    if (response.errorMessages) {
                        this.responseSingle = response;
                    } else {
                        this.router.navigate(['/launchpad', 'plans', response.plan.id, 'workbooks']);
                    }
                    this.currentStates.delete(this.states.loading);
                });
    }

    createWithResource() {
        this.currentStates.add(this.states.loading);
        this.plansService.workbook
            .addCommit(this.route.snapshot.paramMap.get('planId'), '', this.resources)
            .subscribe(
                (response: WorkbookAddCommitResponse.Response) => {
                    if (response.errorMessages) {
                        this.responseMulti = response;
                    } else {
                        this.router.navigate(['/launchpad', 'plans', response.plan.id, 'workbooks']);
                    }
                    this.currentStates.delete(this.states.loading);
                });
    }
}