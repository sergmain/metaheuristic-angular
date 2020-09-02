import { DefaultResponse } from '@src/app/models/DefaultResponse';
import { Account } from './Account';

export interface AccountResult extends DefaultResponse {
    account: Account;
}