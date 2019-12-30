import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { BatchService } from './batch.service';
import { IAppState } from '@src/app/app.reducers';
import { Store, select } from '@ngrx/store';
import { getBatches, getBatchesComplete } from './batch.actions';
import { mergeMap, concatMap, withLatestFrom, map } from 'rxjs/operators';
import { of } from 'rxjs';





@Injectable()
export class BatchEffects {
    constructor(
        private actions: Actions,
        private batchService: BatchService,
        private store: Store < IAppState >
    ) {}

    getBatches = createEffect(() => this.actions.pipe(
        ofType(getBatches),

        concatMap(action => of (action).pipe(
            withLatestFrom(this.store.pipe(select(state => state)))
        )),

        mergeMap(([action, state]) => {
            return this.batchService.batches
                .get({ page: action.page, filterBatches: action.filterBatches })
                .pipe(map(state => {
                    return {
                        type: getBatchesComplete.type,
                        payload: state
                    }
                }))
        })

    ));

}