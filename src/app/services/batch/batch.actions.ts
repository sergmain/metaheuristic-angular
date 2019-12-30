import { createAction, props } from '@ngrx/store';
import { Batch } from './Batch';
import { response } from './response';
import { GetBatchesParams } from './batch.service';
import { BatchExecStatus } from './BatchExecStatus';

const named = (name: string) => `[Batch] ${name}`;


export const getBatches = createAction(named('Get Batches'), props < GetBatchesParams > ());
export const getBatchesComplete = createAction(named('Get Batches Complete'), props < { payload: response.batches.Get } > ());
export const newhExecStatus = createAction(named('New Exec Status'), props < { payload: BatchExecStatus[] } > ())