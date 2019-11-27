import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadStates } from '@app/enums/LoadStates';
import { state } from '@app/helpers/state';
import { WorkbookAddCommitResponse } from '@app/models';
import { PlansService } from '@app/services/plans/plans.service';
import { Store } from '@ngrx/store';
import { IAppState } from '@src/app/app.reducers';
import { Subscription } from 'rxjs';
import { getWorkbook, getPlan } from '@src/app/services/plans/plans.actions';
import { response } from '@src/app/services/plans/response';
@Component({
    selector: 'workbook-add',
    templateUrl: './workbook-add.component.pug',
    styleUrls: ['./workbook-add.component.scss']
})

export class WorkbookAddComponent implements OnInit, OnDestroy {
    readonly states = LoadStates;
    currentStates = new Set();

    state = state;
    currentState = state.show;

    code: string;
    resources: string;

    responseSingle: WorkbookAddCommitResponse.Response;
    responseMulti: WorkbookAddCommitResponse.Response;

    storeSubscription: Subscription;
    planId: string;
    stateGetPlanResponse: response.plan.Get;
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private plansService: PlansService,
        private store: Store < IAppState >
    ) {}

    ngOnInit() {
        this.planId = this.route.snapshot.paramMap.get('planId');
        this.storeSubscription = this.store.subscribe((state => {
            this.stateGetPlanResponse = state.plans.getPlanResponse;
        }));

        this.store.dispatch(getPlan({ id: this.planId }));
    }

    ngOnDestroy() {
        if (this.storeSubscription) {
            this.storeSubscription.unsubscribe();
        }
    }

    cancel() {
        this.router.navigate(['/launchpad', 'plans', this.route.snapshot.paramMap.get('planId'), 'workbooks']);
    }

    createWithCode() {
        this.currentStates.add(this.states.loading);
        this.plansService.workbook
            .addCommit(this.planId, this.code, '')
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