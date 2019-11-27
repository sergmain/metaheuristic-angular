import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap } from 'rxjs/operators';
import { deleteWorkbook, deleteWorkbookSuccess, getPlans, getPlansSuccess, getWorkbooks, getWorkbooksSuccess, getPlan, getPlanSuccess } from './plans.actions';
import { PlansService } from './plans.service';

@Injectable()
export class PlansEffects {
    constructor(
        private actions: Actions,
        private plansService: PlansService,
    ) {}

    getPlans = createEffect(() => this.actions.pipe(
        ofType(getPlans),

        mergeMap((action) => {
            return this.plansService.plans.get(action.pageNumber).pipe(
                map((response) => ({
                    type: getPlansSuccess.type,
                    payload: response
                })),
            );
        })
    ));

    getPlan = createEffect(() => this.actions.pipe(
        ofType(getPlan),
        mergeMap((action) => {
            return this.plansService.plan.get(action.id).pipe(
                map((response) => ({
                    type: getPlanSuccess.type,
                    payload: response
                }))
            )
        })
    ))



    getWorkbooks = createEffect(() => this.actions.pipe(
        ofType(getWorkbooks),

        mergeMap((action) => {
            return this.plansService.workbooks.get(action.planId, action.pageNumber).pipe(
                map((responce) => {
                    return {
                        type: getWorkbooksSuccess.type,
                        payload: responce
                    };
                })
            );
        })
    ));

    deleteWorkbook = createEffect(() => this.actions.pipe(
        ofType(deleteWorkbook),
        mergeMap((action) => {
            return this.plansService.workbook.deleteCommit(action.planId, action.workbookId).pipe(
                map(() => ({ type: deleteWorkbookSuccess.type }))
            );
        })
    ));
}