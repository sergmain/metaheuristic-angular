import { createAction, props } from '@ngrx/store';
import { GetBatchesParams } from './batch.service';
import { BatchesResult } from './BatchesResult';
import { BatchExecStatus } from './BatchExecStatus';

const named = (name: string) => `[Batch] ${name}`;


export const getBatches = createAction(
    named('Get Batches'),
    props<GetBatchesParams>()
);

export const getBatchesComplete = createAction(
    named('Get Batches Complete'),
    props<{ payload: BatchesResult }>()
);

export const newExecStatus = createAction(
    named('New Exec Status'),
    props<{ payload: BatchExecStatus[] }>()
);