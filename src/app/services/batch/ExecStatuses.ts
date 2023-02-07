import { DefaultResponse } from '@app/models/DefaultResponse';
import { BatchExecStatus } from './BatchExecStatus';

export interface ExecStatuses extends DefaultResponse {
    statuses: BatchExecStatus[];
}