import { DefaultResponse } from './DefaultResponse';
import { OperationStatus } from '../enums/OperationStatus';

export interface OperationStatusRest extends DefaultResponse {
    status: OperationStatus;
    errorMessages: string[];
    infoMessages: string[];
}