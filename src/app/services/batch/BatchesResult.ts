import { DefaultResponse } from '@src/app/models/DefaultResponse';
import { Batch } from './Batch';
import { PageableDefault } from '@src/app/models/PageableDefault';
import { DispatcherAssetMode } from '@src/app/enums/DispatcherAssetMode';

export interface BatchesResult extends DefaultResponse {
    batches: { content: Batch[] } & PageableDefault;
    assetMode: DispatcherAssetMode;
}