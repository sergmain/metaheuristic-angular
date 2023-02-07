import { DefaultResponse } from '@app/models/DefaultResponse';
import { PageableDefault } from '@app/models/PageableDefault';
import { ProcessorStatus } from './ProcessorStatus';

export interface Items extends PageableDefault {
    content: ProcessorStatus[];
}

export interface ProcessorsResult extends DefaultResponse {
    items: Items;
}