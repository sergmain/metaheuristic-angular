import { Batch } from './Batch';
import { BatchesResult } from './BatchesResult';

export interface BatchesState {
    isLoading: boolean;
    response: BatchesResult;
    list: Batch[];
}