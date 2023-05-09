import {DefaultResponse} from '@app/models/DefaultResponse';
import {OperationStatusRest} from '@app/models/OperationStatusRest';

export namespace EvaluationData {

    export interface EvaluationInfo {
        evaluationId;
        createdOn: number;
        code: string;
    }
}

