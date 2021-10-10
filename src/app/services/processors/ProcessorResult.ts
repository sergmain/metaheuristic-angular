import { DefaultResponse } from '@app/models/DefaultResponse';
import { Processor } from './Processor';

export interface ProcessorResult extends DefaultResponse {
    processor: Processor;
}