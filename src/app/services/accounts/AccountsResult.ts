import { Pageable } from '@src/app/models/Pageable';
import { DefaultResponse } from '@src/app/models/DefaultResponse';
import { SimpleAccount } from './SimpleAccount';
import { PageableDefault } from '@src/app/models/PageableDefault';

export interface AccountsResult extends DefaultResponse {
    accounts: {
        content: SimpleAccount[];
    } & PageableDefault;
}