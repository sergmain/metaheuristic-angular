import { Pageable } from '@src/app/models/Pageable';
import { DefaultResponse } from '@src/app/models/DefaultResponse';
import { SimpleAccount } from './SimpleAccount';
import { PageableDefault } from '@src/app/models/PageableDefault';
import { DispatcherAssetMode } from '@src/app/enums/DispatcherAssetMode';

export interface AccountsResult extends DefaultResponse {
    accounts: {
        content: SimpleAccount[];
    } & PageableDefault;
    assetMode: DispatcherAssetMode;
}