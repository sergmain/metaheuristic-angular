import { DispatcherAssetMode } from '../../enums/DispatcherAssetMode';
import { DefaultResponse } from '../../models/DefaultResponse';
import { Pageable } from '../../models/Pageable';
import { Sort } from '../../models/Sort';
import { SourceCode } from './SourceCode';

export interface SourceCodesResult extends DefaultResponse {
    items: {
        content: SourceCode[];
        pageable: Pageable;
        size: number;
        number: number;
        sort: Sort;
        numberOfElements: number;
        first: boolean;
        last: boolean;
        empty: boolean;
    };
    assetMode: DispatcherAssetMode;
    experiments: string[];
    batches: string[];
}
