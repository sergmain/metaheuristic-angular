import { PageableDefault } from '@src/app/models/PageableDefault';
import { DispatcherAssetMode } from '../../enums/DispatcherAssetMode';
import { DefaultResponse } from '../../models/DefaultResponse';
import { Pageable } from '../../models/Pageable';
import { Sort } from '../../models/Sort';
import { SourceCode } from './SourceCode';

export interface SourceCodesResult extends DefaultResponse {
    items: {
        content: SourceCode[];
    } & PageableDefault;
    assetMode: DispatcherAssetMode;
    experiments: string[];
    batches: string[];
}
