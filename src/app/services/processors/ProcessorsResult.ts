import { DefaultResponse } from '../../models/DefaultResponse';
import { PageableDefault } from '@src/app/models/PageableDefault';
import { ProcessorStatus } from './ProcessorStatus';

export interface Items extends PageableDefault {
    content: ProcessorStatus[];
}

export interface ProcessorsResult extends DefaultResponse {
    items: Items;
}