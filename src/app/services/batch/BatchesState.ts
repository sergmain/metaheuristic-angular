import { BatchData } from './BatchData';
import { BatchesResult } from './BatchesResult';

export interface BatchesState {
    isLoading: boolean;
    response: BatchesResult;
    list: BatchData.BatchExecInfo[];
}