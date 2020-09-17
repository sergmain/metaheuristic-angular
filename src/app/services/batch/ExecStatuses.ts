import { DefaultResponse } from '@src/app/models/DefaultResponse';
import { BatchExecStatus } from './BatchExecStatus';

export interface ExecStatuses extends DefaultResponse {
    statuses: BatchExecStatus[];
}