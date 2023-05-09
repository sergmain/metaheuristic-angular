import { DefaultResponse } from '@app/models/DefaultResponse';
import { SimpleKb } from './SimpleKb';

export interface SimpleKbResult extends DefaultResponse {
    kb: SimpleKb;
}