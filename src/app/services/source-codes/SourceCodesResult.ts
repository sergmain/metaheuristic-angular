import { PageableDefault } from '@app/models/PageableDefault';
import { DispatcherAssetMode } from '@app/enums/DispatcherAssetMode';
import { DefaultResponse } from '@app/models/DefaultResponse';
import { SourceCode } from './SourceCode';

export interface SourceCodesResult extends DefaultResponse {
    items: {
        content: SourceCode[];
    } & PageableDefault;
    assetMode: DispatcherAssetMode;
    experiments: string[];
    batches: string[];
}
