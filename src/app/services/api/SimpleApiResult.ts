import { DefaultResponse } from '@app/models/DefaultResponse';
import { SimpleApi } from './SimpleApi';

export interface SimpleApiResult extends DefaultResponse {
    api: SimpleApi;
}