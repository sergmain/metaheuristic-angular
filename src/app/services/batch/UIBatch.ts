import { BatchData } from './BatchData';

export interface UIBatch {
    batch: BatchData.BatchExecInfo;
    checked: boolean;
    deleted: boolean;
}