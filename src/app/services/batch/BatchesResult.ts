import { DefaultResponse } from '@app/models/DefaultResponse';
import { PageableDefault } from '@app/models/PageableDefault';
import { DispatcherAssetMode } from '@app/enums/DispatcherAssetMode';
import { BatchData } from './BatchData';

export interface BatchesResult extends DefaultResponse {
    batches: { content: BatchData.BatchExecInfo[] } & PageableDefault;
    assetMode: DispatcherAssetMode;
}