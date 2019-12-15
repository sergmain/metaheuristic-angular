import { DefaultResponse } from '@app/models/DefaultResponse';
import { IPlan } from '@app/services/plans/IPlan';
import { Batches } from './Batches';
import { BatchExecStatus } from './BatchExecStatus';

export namespace response {
    export namespace batches {
        export interface Get extends DefaultResponse {
            batches: Batches;
        }

    }

    export namespace batch {
        export interface Status extends DefaultResponse {
            batchId: number | string;
            console: string;
            ok: boolean;
        }
        export interface Add extends DefaultResponse {
            items: IPlan[];
        }
        export interface Upload extends DefaultResponse {

        }
        export interface ExecStatuses extends DefaultResponse {
            statuses: BatchExecStatus[];
        }
    }
}