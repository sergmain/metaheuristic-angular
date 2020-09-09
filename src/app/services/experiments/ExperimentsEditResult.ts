import { DefaultResponse } from '@src/app/models/DefaultResponse';
import { SimpleExperiment } from './SimpleExperiment';

export interface ExperimentsEditResult extends DefaultResponse {
    simpleExperiment: SimpleExperiment;
}