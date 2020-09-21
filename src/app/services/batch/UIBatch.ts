import { Batch } from './Batch';
import { BatchExecInfo } from './BatchExecInfo';

export interface UIBatch {
    batch: BatchExecInfo;
    checked: boolean;
    deleted: boolean;
}