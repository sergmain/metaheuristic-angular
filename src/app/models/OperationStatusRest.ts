import { DefaultResponse } from './DefaultResponse';
import { OperationStatus } from './OperationStatus';

export interface OperationStatusRest extends DefaultResponse {
    status: OperationStatus;
    errorMessages: string[];
    infoMessages: string[];
}