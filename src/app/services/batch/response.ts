import { DefaultResponse } from '@app/models/DefaultResponse';
import { BatchExecStatus } from './BatchExecStatus';

export namespace response {

    export namespace batch {
        export interface Status extends DefaultResponse {
            batchId: number | string;
            console: string;
            ok: boolean;
        }


        export interface Upload extends DefaultResponse {

        }
        export interface ExecStatuses extends DefaultResponse {
            statuses: BatchExecStatus[];
        }
    }
}