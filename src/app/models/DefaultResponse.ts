import { OperationStatus } from './OperationStatus';

export interface DefaultResponse {
    errorMessages: string[];
    infoMessages: string[];
    errorMessagesAsStr: string;
    // TODO: replace
    status: OperationStatus;
    errorMessagesAsList: string[];
    infoMessagesAsList: string[];
}