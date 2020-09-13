import { DefaultResponse } from '@src/app/models/DefaultResponse';
import { SimpleAccount } from '../accounts';
import { Role } from '../authentication/Role';

export interface AccountWithRoleResult extends DefaultResponse {
    account: SimpleAccount;
    possibleRoles: Role[];
}