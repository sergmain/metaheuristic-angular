import { Account } from './Account';
import { Pageable } from '@src/app/models/Pageable';
import { Sort } from '@src/app/models/Sort';
import { DefaultResponse } from '@src/app/models/DefaultResponse';
import { SimpleAccount } from './SimpleAccount';

export namespace response {
    export namespace accounts {
        export interface Get extends DefaultResponse {
            accounts: {
                content: SimpleAccount[];
                pageable: Pageable;
                totalPages: number;
                last: boolean;
                totalElements: number;
                number: number;
                size: number;
                sort: Sort;
                numberOfElements: number;
                first: boolean;
                empty: boolean;
            };
        }
    }



    export namespace account {
        export interface Get extends DefaultResponse {
            account: Account;
        }
    }
}