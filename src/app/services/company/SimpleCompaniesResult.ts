import { DefaultResponse } from '@src/app/models/DefaultResponse';
import { DispatcherAssetMode } from '@src/app/enums/DispatcherAssetMode';
import { Pageable } from '@src/app/models/Pageable';
import { Sort } from '@src/app/models/Sort';
import { SimpleCompany } from './SimpleCompany';
import { PageableDefault } from '@src/app/models/PageableDefault';

export interface SimpleCompaniesResult extends DefaultResponse {
    companies: PageableDefault & {
        content: SimpleCompany[];
    };
    assetMode: DispatcherAssetMode;
}
