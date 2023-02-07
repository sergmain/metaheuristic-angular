import { DefaultResponse } from '@app/models/DefaultResponse';
import { SimpleAccount } from './SimpleAccount';

export interface AccountResult extends DefaultResponse {
    account: SimpleAccount;
}