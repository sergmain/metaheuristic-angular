import { OperationStatus } from './OperationStatus';
import { ValidationResult } from '../services/source-codes/ValidationResult';

export interface DefaultResponse {
    errorMessages: string[];
    infoMessages: string[];
    errorMessagesAsStr: string;
    errorMessagesAsList: string[];
    infoMessagesAsList: string[];

    status?: OperationStatus;
    validationResult?: ValidationResult;
}