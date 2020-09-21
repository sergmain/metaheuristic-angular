import { DefaultResponse } from '@src/app/models/DefaultResponse';
import { PageableDefault } from '@src/app/models/PageableDefault';
import { DispatcherAssetMode } from '@src/app/enums/DispatcherAssetMode';
import { BatchExecInfo } from './BatchExecInfo';

export interface BatchesResult extends DefaultResponse {
    batches: { content: BatchExecInfo[] } & PageableDefault;
    assetMode: DispatcherAssetMode;
}