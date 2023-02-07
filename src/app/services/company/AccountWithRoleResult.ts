import { DefaultResponse } from '@app/models/DefaultResponse';
import { SimpleAccount } from '@app/services/accounts';
import { Role } from '@app/services/authentication';

export interface AccountWithRoleResult extends DefaultResponse {
    account: SimpleAccount;
    possibleRoles: Role[];
}