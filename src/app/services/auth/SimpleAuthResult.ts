import { DefaultResponse } from '@app/models/DefaultResponse';
import { SimpleAuth } from './SimpleAuth';

export interface SimpleAuthResult extends DefaultResponse {
    auth: SimpleAuth;
}