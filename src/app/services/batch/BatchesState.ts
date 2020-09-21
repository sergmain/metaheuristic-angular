import { Batch } from './Batch';
import { BatchesResult } from './BatchesResult';
import { BatchExecInfo } from './BatchExecInfo';

export interface BatchesState {
    isLoading: boolean;
    response: BatchesResult;
    list: BatchExecInfo[];
}