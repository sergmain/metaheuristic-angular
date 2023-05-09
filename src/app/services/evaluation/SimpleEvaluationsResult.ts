import { DefaultResponse } from '@app/models/DefaultResponse';
import { PageableDefault } from '@app/models/PageableDefault';
import { SimpleEvaluation } from "./SimpleEvaluation";

export interface SimpleEvaluationsResult extends DefaultResponse {
    evaluations: {
        content: SimpleEvaluation[];
    } & PageableDefault;
}
