import { Batch } from '../beans/Batch';
import { DefaultResponse } from '../DefaultResponse';
import { OperationStatusRest } from '../OperationStatusRest';

export namespace BatchData {
    export interface Status {
        batchId: number;
        console: string;
        ok: boolean;
    }

    export interface BulkOperation {
        batchId: number;
        status: OperationStatusRest;
    }

    export interface BulkOperations {
        operations: BulkOperation[];
    }

    export interface BatchExecInfo {
        batch: Batch;
        sourceCodeUid: string;
        execStateStr: string;
        execState: number;
        ok: boolean;
        uploadedFileName: string;
        username: string;
    }
    export interface UploadingStatus extends DefaultResponse {
        batchId: number;
        execContextId: number;
    }
}