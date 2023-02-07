import { DefaultResponse } from '@app/models/DefaultResponse';
import { SimpleAccount } from './SimpleAccount';
import { PageableDefault } from '@app/models/PageableDefault';
import { DispatcherAssetMode } from '@app/enums/DispatcherAssetMode';

export interface AccountsResult extends DefaultResponse {
    accounts: {
        content: SimpleAccount[];
    } & PageableDefault;
    assetMode: DispatcherAssetMode;
}