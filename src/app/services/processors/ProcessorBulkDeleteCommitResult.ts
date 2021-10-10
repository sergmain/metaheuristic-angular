import { OperationStatusRest } from '@app/models/OperationStatusRest';

export interface ProcessorBulkDeleteCommitResult {
    operations: {
        processorId: number,
        status: OperationStatusRest
    }[];
}