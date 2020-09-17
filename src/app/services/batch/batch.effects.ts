import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { BatchService } from './batch.service';
import { AppState } from '@src/app/app.reducers';
import { Store, select } from '@ngrx/store';
import { getBatches, getBatchesComplete } from './batch.actions';
import { mergeMap, concatMap, withLatestFrom, map } from 'rxjs/operators';
import { of } from 'rxjs';





@Injectable()
export class BatchEffects {
    constructor(
        private actions: Actions,
        private batchService: BatchService,
        private store: Store<AppState>
    ) { }

    getBatches = createEffect(() => this.actions.pipe(
        ofType(getBatches),

        concatMap(action => of(action).pipe(
            withLatestFrom(this.store.pipe(select(state => state)))
        )),

        mergeMap(([action, state]) => {
            return this.batchService
                .batches(action.page.toString(), action.filterBatches)
                .pipe(map(state => {
                    return {
                        type: getBatchesComplete.type,
                        payload: state
                    };
                }));
        })
    ));
}