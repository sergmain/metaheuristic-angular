import { OperationStatusRest } from "@src/app/models/OperationStatusRest";

export interface ProcessorBulkDeleteCommitResult {
    operations: {
        processorId: number,
        status: OperationStatusRest
    }[]
}