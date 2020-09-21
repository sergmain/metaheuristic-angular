import { Action, createReducer, on } from '@ngrx/store';
import { getBatches, getBatchesComplete, newExecStatus } from './batch.actions';
import { BatchesState } from './BatchesState';
import { BatchService } from './batch.service';

export const initialState: BatchesState = {
    isLoading: false,
    response: null,
    list: []
};

const reducer = createReducer(
    initialState,
    on(getBatches, (state: BatchesState, { page, filterBatches }) => ({
        ...state,
        isLoading: true,
        page,
        filterBatches
    })),
    on(getBatchesComplete, (state: BatchesState, { payload }) => ({
        ...state,
        list: payload.batches.content,
        response: payload,
        isLoading: false
    })),

    on(newExecStatus, (state: BatchesState, { payload }) => {
        // через JSON потому что всегда execState read-only
        let _state = JSON.parse(JSON.stringify(state));
        payload.forEach(status => {
            _state.list
                .filter(batch => batch.batch.id === status.id)
                .forEach(batch => {
                    batch.execState = status.state;
                });
        });
        return { ..._state };
    })

);

export function batchReducer(state: BatchesState, action: Action) {
    return reducer(state, action);
}