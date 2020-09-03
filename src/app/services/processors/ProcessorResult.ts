import { DefaultResponse } from '../../models/DefaultResponse';
import { Processor } from './Processor';

export interface ProcessorResult extends DefaultResponse {
    processor: Processor;
}