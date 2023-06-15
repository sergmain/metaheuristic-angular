import {DefaultResponse} from '@app/models/DefaultResponse';

export interface StepEvaluationPrepareResult extends DefaultResponse {
    uuid: string;
    inputs: string[];
    error: string;
}
