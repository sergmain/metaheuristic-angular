import { PageableDefault } from '@src/app/models/PageableDefault';
import { DefaultResponse } from '@src/app/models/DefaultResponse';
import { ExperimentResult } from './ExperimentResult';

export interface ExperimentsResult extends DefaultResponse {
    items: Items;
}

export interface Items extends PageableDefault {
    content: ExperimentResult[];
}