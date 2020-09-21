import { DefaultResponse } from '@src/app/models/DefaultResponse';
import { PageableDefault } from '@src/app/models/PageableDefault';
import { DispatcherAssetMode } from '@src/app/enums/DispatcherAssetMode';
import { BatchData } from './BatchData';

export interface BatchesResult extends DefaultResponse {
    batches: { content: BatchData.BatchExecInfo[] } & PageableDefault;
    assetMode: DispatcherAssetMode;
}